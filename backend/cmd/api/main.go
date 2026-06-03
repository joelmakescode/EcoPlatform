package main

import (
	"backend/generated"
	"backend/internal/application/services"
	"backend/internal/infrastructure/games"
	"backend/internal/infrastructure/http/handlers"
	"backend/internal/infrastructure/http/middleware"
	"backend/internal/infrastructure/persistence/repository"
	"backend/internal/infrastructure/websocket"
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/go-faster/errors"
	"github.com/ogen-go/ogen/ogenerrors"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	db := connectDB()

	hub := websocket.NewHub()
	go hub.Run()

	casinoRepository := repository.NewCasinoRepository(db)
	discordUserRepository := repository.NewDiscordUserRepository(db)
	transactionRepository := repository.NewTransactionRepository(db)
	userRepository := repository.NewUserRepository(db)

	authService := services.NewAuthService(userRepository)
	casinoService := services.NewCasinoService(casinoRepository, userRepository)
	discordUserService := services.NewDiscordUserService(discordUserRepository)
	transactionService := services.NewTransactionService(transactionRepository, userRepository)
	userService := services.NewUserService(userRepository)

	wsHandler := websocket.NewHandler(hub, []byte("ecoplatform"))
	userService.SetNotifier(wsHandler)
	transactionService.SetNotifier(wsHandler)
	casinoService.SetNotifier(wsHandler)

	handlers := handler.NewHandler(
		handler.NewCasinoHandler(casinoService),
		handler.NewDiscordUserHandler(discordUserService),
		handler.NewAuthHandler(authService),
		handler.NewTransactionHandler(transactionService),
		handler.NewUserHandler(userService),
	)

	server, err := api.NewServer(handlers, api.WithPathPrefix("/api"), api.WithErrorHandler(errorHandler))
	if err != nil {
		log.Fatal(err)
	}

	game := games.NewRollADiceHandler(casinoRepository, wsHandler)
	casinoService.SetGame(game)
	wsHandler.Connect(func(client *websocket.Client) {
		game.SendCurrentGameState(client)
	})
	go game.Start()

	mux := http.NewServeMux()
	mux.Handle("/api/", middleware.CORS(middleware.AuthMiddleware(middleware.BotAuthMiddleware(server))))
	mux.HandleFunc("/ws", wsHandler.ServeHTTP)

	wrapped := middleware.CORS(mux)

	log.Println("API listening on :8080")
	log.Println("WebSocket endpoint available at ws://localhost:8080/ws")
	log.Fatal(http.ListenAndServe(":8080", wrapped))
}

func errorHandler(_ context.Context, w http.ResponseWriter, _ *http.Request, err error) {
	code := http.StatusInternalServerError
	var decReqErr *ogenerrors.DecodeRequestError
	var decParamErr *ogenerrors.DecodeParamsError
	switch {
	case errors.As(err, &decReqErr), errors.As(err, &decParamErr):
		code = http.StatusBadRequest
	}
	log.Printf("Ogen error (HTTP %d): %v", code, err)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	_, _ = fmt.Fprintf(w, `{"message":%q}`, err.Error())
	log.Printf("Ogen ErrorService: %v", err)

	http.Error(w, "Internal Server ErrorService", http.StatusInternalServerError)
}

func connectDB() *gorm.DB {
	dsn := "ecoplatform:1@tcp(db:3306)/ecoplatform?parseTime=true"

	var db *gorm.DB
	var err error

	for i := 1; i <= 15; i++ {
		db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
		if err == nil {
			log.Println("Connected to Database")
			return db
		}

		log.Printf("DB not ready (%d/15): %v", i, err)
		time.Sleep(2 * time.Second)
	}

	log.Fatalf("Failed to connect to Database after retries: %v", err)
	return nil
}
