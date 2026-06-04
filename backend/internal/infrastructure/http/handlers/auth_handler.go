package handler

import (
	"backend/generated"
	"backend/internal/application/services"
	"backend/internal/domain"
	"context"

	"errors"
)

type AuthHandler struct {
	service *services.AuthService
}

func NewAuthHandler(service *services.AuthService) *AuthHandler {
	return &AuthHandler{service: service}
}

func (h *AuthHandler) LoginUser(ctx context.Context, req *api.LoginData) (api.LoginUserRes, error) {
	token, err := h.service.Login(req.Email, req.Password)
	if err != nil {
		switch {
		case errors.Is(err, domain.ErrInvalidEmailOrPassword):
			return &api.LoginUserBadRequest{Message: api.NewOptString(err.Error())}, nil
		case errors.Is(err, domain.ErrInvalidPassword):
			return &api.LoginUserUnauthorized{Message: api.NewOptString(err.Error())}, nil
		case errors.Is(err, domain.ErrUserNotFound):
			return &api.LoginUserNotFound{Message: api.NewOptString(err.Error())}, nil
		default:
			return &api.LoginUserInternalServerError{Message: api.NewOptString(err.Error())}, nil
		}
	}

	return &api.Token{Token: token}, nil
}
