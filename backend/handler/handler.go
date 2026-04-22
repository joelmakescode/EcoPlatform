package handler

import "backend/api"

type Handler struct {
	api.DiscordUsersHandler
	api.LoginHandler
	api.UsersHandler
}

func NewHandler(discordUsersHandler api.DiscordUsersHandler, loginHandler api.LoginHandler, usersHandler api.UsersHandler) api.Handler {
	return &Handler{DiscordUsersHandler: discordUsersHandler, LoginHandler: loginHandler, UsersHandler: usersHandler}
}
