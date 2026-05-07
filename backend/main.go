package main

import (
	"backend/api"
	"backend/handler"
	"backend/middleware"
	"backend/repository"
	"backend/service"
	"backend/websocket"
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

	handlers := initDependencies(db, hub)

	server, err := api.NewServer(handlers, api.WithPathPrefix("/api"), api.WithErrorHandler(errorHandler))
	if err != nil {
		log.Fatal(err)
	}

	wsHandler := websocket.NewHandler(hub, []byte("ecoplatform"))

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

func initDependencies(gormDB *gorm.DB, hub *websocket.Hub) api.Handler {
	discordUserRepository := repository.NewDiscordUserRepository(gormDB)
	transactionRepository := repository.NewTransactionRepository(gormDB)
	userRepository := repository.NewUserRepository(gormDB)

	authService := service.NewAuthService(userRepository)
	discordUserService := service.NewDiscordUserService(discordUserRepository)
	transactionService := service.NewTransactionService(transactionRepository, userRepository)
	userService := service.NewUserService(userRepository)

	wsHandler := websocket.NewHandler(hub, []byte("ecoplatform"))
	transactionService.SetWebSocketHandler(wsHandler)

	authHandler := handler.NewAuthHandler(authService)
	discordUserHandler := handler.NewDiscordUserHandler(discordUserService)
	transactionHandler := handler.NewTransactionHandler(transactionService)
	userHandler := handler.NewUserHandler(userService)

	return handler.NewHandler(discordUserHandler, authHandler, transactionHandler, userHandler)
}
