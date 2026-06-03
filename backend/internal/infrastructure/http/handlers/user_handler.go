package handlers

import (
	"backend/api"
	"backend/internal/application/services"
	"context"

	"errors"
)

type UserHandler struct {
	userService *service.UserService
}

func NewUserHandler(userService *service.UserService) *UserHandler {
	return &UserHandler{userService: userService}
}

func (h *UserHandler) ClaimDailyBalance(ctx context.Context, param api.ClaimDailyBalanceParams) (api.ClaimDailyBalanceRes, error) {
	if err := authz.Self(ctx, uint(param.ID)); err != nil {
		return &api.ClaimDailyBalanceForbidden{Message: api.NewOptString(err.Error())}, nil
	}

	if err := h.service.ClaimDaily(uint(param.ID)); err != nil {
		switch {

		case errors.Is(err, service.ErrUserNotFound):
			return &api.ClaimDailyBalanceNotFound{Message: api.NewOptString(err.Error())}, nil

		case errors.Is(err, service.ErrDailyAlreadyClaimed):
			return &api.ClaimDailyBalanceConflict{Message: api.NewOptString(err.Error())}, nil

		default:
			return &api.ClaimDailyBalanceInternalServerError{Message: api.NewOptString(err.Error())}, nil

		}
	}

	return &api.ClaimDailyBalanceNoContent{}, nil
}

func (h *UserHandler) CreateUser(ctx context.Context, req *api.CreateUserData) (api.CreateUserRes, error) {

	created, err := h.service.CreateUser(req)

	if err != nil {
		switch {

		case errors.Is(err, service.ErrInvalidPassword) ||
			errors.Is(err, service.ErrPasswordNotHashed) ||
			errors.Is(err, service.ErrUserCreateEmptyFields):
			return &api.CreateUserBadRequest{Message: api.NewOptString(err.Error())}, nil

		case errors.Is(err, service.ErrUniqueConstraint):
			return &api.CreateUserConflict{Message: api.NewOptString(err.Error())}, nil

		default:
			return &api.CreateUserInternalServerError{Message: api.NewOptString(err.Error())}, nil

		}
	}

	return created, nil
}

func (h *UserHandler) GetDailyClaimStatus(ctx context.Context, param api.GetDailyClaimStatusParams) (api.GetDailyClaimStatusRes, error) {
	if err := authz.Self(ctx, uint(param.ID)); err != nil {
		return &api.GetDailyClaimStatusForbidden{Message: api.NewOptString(err.Error())}, nil
	}

	ok, err := h.service.GetDailyClaimStatus(uint(param.ID))
	if err != nil {
		switch {

		case errors.Is(err, service.ErrNoUserID):
			return &api.GetDailyClaimStatusBadRequest{Message: api.NewOptString(err.Error())}, nil

		case errors.Is(err, service.ErrUserNotFound):
			return &api.GetDailyClaimStatusNotFound{Message: api.NewOptString(err.Error())}, nil

		default:
			return &api.GetDailyClaimStatusInternalServerError{Message: api.NewOptString(err.Error())}, nil

		}
	}

	return &api.DailyClaimStatus{CanClaim: ok}, nil
}

func (h *UserHandler) GetUserById(ctx context.Context, params api.GetUserByIdParams) (api.GetUserByIdRes, error) {
	if err := authz.Self(ctx, uint(params.ID)); err != nil {
		return &api.GetUserByIdForbidden{Message: api.NewOptString(err.Error())}, nil
	}

	user, err := h.service.GetUserById(uint(params.ID))
	if err != nil {
		switch {
		case errors.Is(err, service.ErrUserNotFound):
			return &api.GetUserByIdNotFound{Message: api.NewOptString(err.Error())}, nil
		default:
			return &api.GetUserByIdInternalServerError{Message: api.NewOptString(err.Error())}, nil
		}
	}

	return user, nil
}

func (h *UserHandler) GetUserBalanceById(ctx context.Context, params api.GetUserBalanceByIdParams) (api.GetUserBalanceByIdRes, error) {
	if err := authz.Self(ctx, uint(params.ID)); err != nil {
		return &api.GetUserBalanceByIdForbidden{Message: api.NewOptString(err.Error())}, nil
	}

	balance, err := h.service.GetUserBalanceById(uint(params.ID))
	if err != nil {
		switch {
		case errors.Is(err, service.ErrUserNotFound):
			return &api.GetUserBalanceByIdNotFound{Message: api.NewOptString(err.Error())}, nil
		default:
			return &api.GetUserBalanceByIdInternalServerError{Message: api.NewOptString(err.Error())}, nil
		}
	}

	return balance, nil
}

func (h *UserHandler) UpdateUserBalanceById(ctx context.Context, req *api.Balance, params api.UpdateUserBalanceByIdParams) (api.UpdateUserBalanceByIdRes, error) {
	if err := authz.Self(ctx, uint(params.ID)); err != nil {
		return &api.UpdateUserBalanceByIdForbidden{Message: api.NewOptString(err.Error())}, nil
	}

	balance, err := h.service.UpdateUserBalanceById(uint(params.ID), req.Balance)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrUserNotFound):
			return &api.UpdateUserBalanceByIdNotFound{Message: api.NewOptString(err.Error())}, nil
		default:
			return &api.UpdateUserBalanceByIdInternalServerError{Message: api.NewOptString(err.Error())}, nil
		}
	}

	return balance, nil
}

func (h *UserHandler) CreateLinkAccountCode(ctx context.Context, params api.CreateLinkAccountCodeParams) (api.CreateLinkAccountCodeRes, error) {
	code, err := h.service.CreateLinkAccountCode(params.ID)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrInvalidAccountId):
			return &api.CreateLinkAccountCodeBadRequest{Message: api.NewOptString(err.Error())}, nil
		case errors.Is(err, service.ErrUserNotFound):
			return &api.CreateLinkAccountCodeNotFound{Message: api.NewOptString(err.Error())}, nil
		default:
			return &api.CreateLinkAccountCodeInternalServerError{Message: api.NewOptString(err.Error())}, nil
		}
	}

	return code, nil
}
