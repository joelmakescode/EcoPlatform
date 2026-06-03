package handler

import "backend/generated"

type Handler struct {
	api.CasinoHandler
	api.DiscordUsersHandler
	api.LoginHandler
	api.TransactionsHandler
	api.UsersHandler
}

func NewHandler(casinoHandler api.CasinoHandler, discordUsersHandler api.DiscordUsersHandler, loginHandler api.LoginHandler, transactionsHandler api.TransactionsHandler, usersHandler api.UsersHandler) api.Handler {
	return &Handler{CasinoHandler: casinoHandler, DiscordUsersHandler: discordUsersHandler, LoginHandler: loginHandler, TransactionsHandler: transactionsHandler, UsersHandler: usersHandler}
}
