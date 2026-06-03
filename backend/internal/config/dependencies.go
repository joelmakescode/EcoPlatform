package config

import (
	api "backend/generated"
	"backend/internal/application/services"
	"backend/internal/infrastructure/games"
	handler "backend/internal/infrastructure/http/handlers"
	"backend/internal/infrastructure/persistence/repository"
	"backend/internal/infrastructure/websocket"

	"gorm.io/gorm"
)

type Dependencies struct {
	DB *gorm.DB

	WebSocketHub     *websocket.Hub
	WebSocketHandler *websocket.Handler

	AuthService        *services.AuthService
	CasinoService      *services.CasinoService
	DiscordUserService *services.DiscordUserService
	TransactionService *services.TransactionService
	UserService        *services.UserService

	APIHandlers api.Handler
}

func NewDependencies(db *gorm.DB) (*Dependencies, error) {
	hub := websocket.NewHub()
	websocketHandler := websocket.NewHandler(hub, []byte("ecoplatform"))

	casinoRepository := repository.NewCasinoRepository(db)
	discordUserRepository := repository.NewDiscordUserRepository(db)
	transactionRepository := repository.NewTransactionRepository(db)
	userRepository := repository.NewUserRepository(db)

	game := games.NewRollADiceHandler(casinoRepository, websocketHandler)

	authService := services.NewAuthService(userRepository)
	casinoService := services.NewCasinoService(websocketHandler, casinoRepository, userRepository, game)
	discordUserService := services.NewDiscordUserService(discordUserRepository)
	transactionService := services.NewTransactionService(websocketHandler, transactionRepository, userRepository)
	userService := services.NewUserService(websocketHandler, userRepository)

	apiHandlers := handler.NewHandler(
		handler.NewCasinoHandler(casinoService),
		handler.NewDiscordUserHandler(discordUserService),
		handler.NewAuthHandler(authService),
		handler.NewTransactionHandler(transactionService),
		handler.NewUserHandler(userService),
	)

	return &Dependencies{
		DB:                 db,
		WebSocketHub:       hub,
		WebSocketHandler:   websocketHandler,
		AuthService:        authService,
		CasinoService:      casinoService,
		DiscordUserService: discordUserService,
		TransactionService: transactionService,
		UserService:        userService,
		APIHandlers:        apiHandlers,
	}, nil
}
