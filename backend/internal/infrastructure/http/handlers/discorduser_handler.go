package handler

import (
	"backend/generated"
	"backend/internal/application/services"
	"backend/internal/domain"
	"context"

	"errors"
)

type DiscordUserHandler struct {
	service *services.DiscordUserService
}

func NewDiscordUserHandler(service *services.DiscordUserService) *DiscordUserHandler {
	return &DiscordUserHandler{service: service}
}

func (h *DiscordUserHandler) CreateDiscordUser(ctx context.Context, req *api.CreateDiscordUserData) (api.CreateDiscordUserRes, error) {
	user, err := h.service.CreateUser(req)
	if err != nil {
		switch {
		case errors.Is(err, domain.ErrPasswordNotHashed),
			errors.Is(err, domain.ErrInvalidPassword),
			errors.Is(err, domain.ErrNoDiscordUserID):
			return &api.CreateDiscordUserBadRequest{Message: api.NewOptString(err.Error())}, nil
		case errors.Is(err, domain.ErrUniqueConstraint):
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
		case errors.Is(err, domain.ErrInvalidDiscordIdOrPassword):
			return &api.LoginDiscordUserBadRequest{Message: api.NewOptString(err.Error())}, nil
		case errors.Is(err, domain.ErrInvalidPassword):
			return &api.LoginDiscordUserUnauthorized{Message: api.NewOptString(err.Error())}, nil
		case errors.Is(err, domain.ErrUserNotFound):
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
		case errors.Is(err, domain.ErrNoDiscordUserID):
			return &api.GetDiscordUserAutofillByIdBadRequest{Message: api.NewOptString(err.Error())}, nil
		case errors.Is(err, domain.ErrUserNotFound):
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
		case errors.Is(err, domain.ErrNoDiscordUserID):
			return &api.UpdateDiscordUserAutofillByIdBadRequest{Message: api.NewOptString(err.Error())}, nil
		case errors.Is(err, domain.ErrUserNotFound):
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
		case errors.Is(err, domain.ErrNoDiscordUserID):
			return &api.GetDiscordUserLanguageByIdBadRequest{Message: api.NewOptString(err.Error())}, nil
		case errors.Is(err, domain.ErrUserNotFound):
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
		case errors.Is(err, domain.ErrNoDiscordUserID), errors.Is(err, domain.ErrInvalidLanguage):
			return &api.UpdateDiscordUserLanguageByIdBadRequest{Message: api.NewOptString(err.Error())}, nil
		case errors.Is(err, domain.ErrUserNotFound):
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
		case errors.Is(err, domain.ErrNoDiscordUserID):
			return &api.GetAccountLinkByIdBadRequest{Message: api.NewOptString(err.Error())}, nil
		case errors.Is(err, domain.ErrUserNotFound):
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
		case errors.Is(err, domain.ErrNoDiscordUserID),
			errors.Is(err, domain.ErrInvalidCode),
			errors.Is(err, domain.ErrCodeUsed),
			errors.Is(err, domain.ErrCodeExpired):
			return &api.LinkAccountBadRequest{Message: api.NewOptString(err.Error())}, nil
		case errors.Is(err, domain.ErrNoEntryFoundForCode):
			return &api.LinkAccountNotFound{Message: api.NewOptString(err.Error())}, nil
		case errors.Is(err, domain.ErrUniqueConstraint):
			return &api.LinkAccountConflict{Message: api.NewOptString(err.Error())}, nil
		default:
			return &api.LinkAccountInternalServerError{Message: api.NewOptString(err.Error())}, nil
		}
	}

	return accountId, nil
}
