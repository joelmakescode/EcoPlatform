package main

import (
	"backend/api"
	"backend/internal/infrastructure/game/rolladice"
	"backend/internal/infrastructure/http/handlers"
	middleware2 "backend/internal/infrastructure/http/middleware"
	"backend/internal/infrastructure/persistence/repositories"
	websocket2 "backend/internal/infrastructure/websocket"
	"backend/service"
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

	hub := websocket2.NewHub()
	go hub.Run()

	casinoRepository := repositories.NewCasinoRepository(db)
	discordUserRepository := repositories.NewDiscordUserRepository(db)
	transactionRepository := repositories.NewTransactionRepository(db)
	userRepository := repositories.NewUserRepository(db)

	authService := service.NewAuthService(userRepository)
	casinoService := service.NewCasinoService(casinoRepository, userRepository)
	discordUserService := service.NewDiscordUserService(discordUserRepository)
	transactionService := service.NewTransactionService(transactionRepository, userRepository)
	userService := service.NewUserService(userRepository)

	wsHandler := websocket2.NewHandler(hub, []byte("ecoplatform"))
	userService.SetNotifier(wsHandler)
	transactionService.SetNotifier(wsHandler)
	casinoService.SetNotifier(wsHandler)

	handlers := handlers.NewHandler(
		handlers.NewCasinoHandler(casinoService),
		handlers.NewDiscordUserHandler(discordUserService),
		handlers.NewAuthHandler(authService),
		handlers.NewTransactionHandler(transactionService),
		handlers.NewUserHandler(userService),
	)

	server, err := api.NewServer(handlers, api.WithPathPrefix("/api"), api.WithErrorHandler(errorHandler))
	if err != nil {
		log.Fatal(err)
	}

	game := rolladice.NewRollADiceHandler(casinoRepository, wsHandler)
	casinoService.SetGame(game)
	wsHandler.Connect(func(client *websocket2.Client) {
		game.SendCurrentGameState(client)
	})
	go game.Start()

	mux := http.NewServeMux()
	mux.Handle("/api/", middleware2.CORS(middleware2.AuthMiddleware(middleware2.BotAuthMiddleware(server))))
	mux.HandleFunc("/ws", wsHandler.ServeHTTP)

	wrapped := middleware2.CORS(mux)

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
