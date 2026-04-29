package handler

import "backend/api"

type Handler struct {
	api.DiscordUsersHandler
	api.LoginHandler
	api.TransactionsHandler
	api.UsersHandler
}

func NewHandler(discordUsersHandler api.DiscordUsersHandler, loginHandler api.LoginHandler, transactionsHandler api.TransactionsHandler, usersHandler api.UsersHandler) api.Handler {
	return &Handler{DiscordUsersHandler: discordUsersHandler, LoginHandler: loginHandler, TransactionsHandler: transactionsHandler, UsersHandler: usersHandler}
}
