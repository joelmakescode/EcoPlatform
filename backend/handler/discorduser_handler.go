package handler

import (
	"backend/api"
	"backend/service"
	"context"

	"errors"
)

type DiscordUserHandler struct {
	service *service.DiscordUserService
}

func NewDiscordUserHandler(service *service.DiscordUserService) *DiscordUserHandler {
	return &DiscordUserHandler{service: service}
}

func (h *DiscordUserHandler) CreateDiscordUser(ctx context.Context, req *api.CreateDiscordUserData) (api.CreateDiscordUserRes, error) {
	user, err := h.service.CreateUser(req)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrPasswordNotHashed),
			errors.Is(err, service.ErrInvalidPassword),
			errors.Is(err, service.ErrNoDiscordUserID):
			return &api.CreateDiscordUserBadRequest{Message: api.NewOptString(err.Error())}, nil
		case errors.Is(err, service.ErrUniqueConstraint):
			return &api.CreateDiscordUserConflict{Message: api.NewOptString(err.Error())}, nil
		default:
			return &api.CreateDiscordUserInternalServerError{Message: api.NewOptString(err.Error())}, nil
		}
	}

	return user, nil
}

func (h *DiscordUserHandler) LoginDiscordUser(ctx context.Context, req *api.DiscordUserLoginData) (api.LoginDiscordUserRes, error) {
	user, err := h.service.LoginUser(req)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrInvalidDiscordIdOrPassword):
			return &api.LoginDiscordUserBadRequest{Message: api.NewOptString(err.Error())}, nil
		case errors.Is(err, service.ErrInvalidPassword):
			return &api.LoginDiscordUserUnauthorized{Message: api.NewOptString(err.Error())}, nil
		case errors.Is(err, service.ErrUserNotFound):
			return &api.LoginDiscordUserNotFound{Message: api.NewOptString(err.Error())}, nil
		default:
			return &api.LoginDiscordUserInternalServerError{Message: api.NewOptString(err.Error())}, nil
		}
	}

	return user, nil
}

func (h *DiscordUserHandler) GetDiscordUserAutofillById(ctx context.Context, params api.GetDiscordUserAutofillByIdParams) (api.GetDiscordUserAutofillByIdRes, error) {
	autofill, err := h.service.GetAutofillById(params.ID)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrNoDiscordUserID):
			return &api.GetDiscordUserAutofillByIdBadRequest{Message: api.NewOptString(err.Error())}, nil
		case errors.Is(err, service.ErrUserNotFound):
			return &api.GetDiscordUserAutofillByIdNotFound{Message: api.NewOptString(err.Error())}, nil
		default:
			return &api.GetDiscordUserAutofillByIdInternalServerError{Message: api.NewOptString(err.Error())}, nil
		}
	}

	return autofill, nil
}

func (h *DiscordUserHandler) UpdateDiscordUserAutofillById(ctx context.Context, params api.UpdateDiscordUserAutofillByIdParams) (api.UpdateDiscordUserAutofillByIdRes, error) {
	autofill, err := h.service.UpdateAutofillById(params.ID)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrNoDiscordUserID):
			return &api.UpdateDiscordUserAutofillByIdBadRequest{Message: api.NewOptString(err.Error())}, nil
		case errors.Is(err, service.ErrUserNotFound):
			return &api.UpdateDiscordUserAutofillByIdNotFound{Message: api.NewOptString(err.Error())}, nil
		default:
			return &api.UpdateDiscordUserAutofillByIdInternalServerError{Message: api.NewOptString(err.Error())}, nil
		}
	}

	return autofill, nil
}

func (h *DiscordUserHandler) GetDiscordUserLanguageById(ctx context.Context, params api.GetDiscordUserLanguageByIdParams) (api.GetDiscordUserLanguageByIdRes, error) {
	language, err := h.service.GetLanguageById(params.ID)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrNoDiscordUserID):
			return &api.GetDiscordUserLanguageByIdBadRequest{Message: api.NewOptString(err.Error())}, nil
		case errors.Is(err, service.ErrUserNotFound):
			return &api.GetDiscordUserLanguageByIdNotFound{Message: api.NewOptString(err.Error())}, nil
		default:
			return &api.GetDiscordUserLanguageByIdInternalServerError{Message: api.NewOptString(err.Error())}, nil
		}
	}

	return language, nil
}

func (h *DiscordUserHandler) UpdateDiscordUserLanguageById(ctx context.Context, req *api.DiscordUserLanguage, params api.UpdateDiscordUserLanguageByIdParams) (api.UpdateDiscordUserLanguageByIdRes, error) {
	language, err := h.service.UpdateLanguageById(params.ID, req.Language)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrNoDiscordUserID), errors.Is(err, service.ErrInvalidLanguage):
			return &api.UpdateDiscordUserLanguageByIdBadRequest{Message: api.NewOptString(err.Error())}, nil
		case errors.Is(err, service.ErrUserNotFound):
			return &api.UpdateDiscordUserLanguageByIdNotFound{Message: api.NewOptString(err.Error())}, nil
		default:
			return &api.UpdateDiscordUserLanguageByIdInternalServerError{Message: api.NewOptString(err.Error())}, nil
		}
	}

	return language, err
}

func (h *DiscordUserHandler) GetAccountLinkById(ctx context.Context, params api.GetAccountLinkByIdParams) (api.GetAccountLinkByIdRes, error) {
	link, err := h.service.GetAccountLinkById(params.ID)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrNoDiscordUserID):
			return &api.GetAccountLinkByIdBadRequest{Message: api.NewOptString(err.Error())}, nil
		case errors.Is(err, service.ErrUserNotFound):
			return &api.GetAccountLinkByIdNotFound{Message: api.NewOptString(err.Error())}, nil
		default:
			return &api.GetAccountLinkByIdInternalServerError{Message: api.NewOptString(err.Error())}, nil
		}
	}

	return link, err
}

func (h *DiscordUserHandler) LinkAccount(ctx context.Context, req *api.LinkCode, params api.LinkAccountParams) (api.LinkAccountRes, error) {
	accountId, err := h.service.LinkAccount(params.ID, req.Code)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrNoDiscordUserID),
			errors.Is(err, service.ErrInvalidCode),
			errors.Is(err, service.ErrCodeUsed),
			errors.Is(err, service.ErrCodeExpired):
			return &api.LinkAccountBadRequest{Message: api.NewOptString(err.Error())}, nil
		case errors.Is(err, service.ErrNoEntryFoundForCode):
			return &api.LinkAccountNotFound{Message: api.NewOptString(err.Error())}, nil
		case errors.Is(err, service.ErrUniqueConstraint):
			return &api.LinkAccountConflict{Message: api.NewOptString(err.Error())}, nil
		default:
			return &api.LinkAccountInternalServerError{Message: api.NewOptString(err.Error())}, nil
		}
	}

	return accountId, nil
}
