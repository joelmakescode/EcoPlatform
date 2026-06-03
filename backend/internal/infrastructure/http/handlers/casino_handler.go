package handlers

import (
	"backend/api"
	"backend/handler/authz"
	"backend/service"
	"context"
	"errors"
)

type CasinoHandler struct {
	service *service.CasinoService
}

func NewCasinoHandler(service *service.CasinoService) *CasinoHandler {
	return &CasinoHandler{service: service}
}

func (h *CasinoHandler) CashoutCasinoBalance(ctx context.Context, req *api.Balance, param api.CashoutCasinoBalanceParams) (api.CashoutCasinoBalanceRes, error) {
	if err := authz.Self(ctx, uint(param.ID)); err != nil {
		return &api.CashoutCasinoBalanceForbidden{Message: api.NewOptString(err.Error())}, nil
	}

	err := h.service.CashoutCasinoBalance(uint(param.ID), req.Balance)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrInvalidAmount):
			return &api.CashoutCasinoBalanceBadRequest{Message: api.NewOptString(err.Error())}, nil

		case errors.Is(err, service.ErrUserNotFound):
			return &api.CashoutCasinoBalanceNotFound{Message: api.NewOptString(err.Error())}, nil

		default:
			return &api.CashoutCasinoBalanceInternalServerError{Message: api.NewOptString(err.Error())}, nil
		}
	}

	return &api.CashoutCasinoBalanceNoContent{}, nil
}

func (h *CasinoHandler) CreateBetRollADice(ctx context.Context, req *api.BetRollADice, param api.CreateBetRollADiceParams) (api.CreateBetRollADiceRes, error) {
	if err := authz.Self(ctx, uint(param.ID)); err != nil {
		return &api.CreateBetRollADiceForbidden{Message: api.NewOptString(err.Error())}, nil
	}

	err := h.service.CreateBetRollADice(uint(param.ID), req.Bets)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrInvalidStake),
			errors.Is(err, service.ErrStakeOptionDoesntExist):
			return &api.CreateBetRollADiceBadRequest{Message: api.NewOptString(err.Error())}, nil
		case errors.Is(err, service.ErrInsufficientBalance):
			return &api.CreateBetRollADiceConflict{Message: api.NewOptString(err.Error())}, nil
		default:
			return &api.CreateBetRollADiceInternalServerError{Message: api.NewOptString(err.Error())}, nil
		}
	}

	return &api.CreateBetRollADiceNoContent{}, nil
}

func (h *CasinoHandler) DepositCasinoBalance(ctx context.Context, req *api.Balance, param api.DepositCasinoBalanceParams) (api.DepositCasinoBalanceRes, error) {
	if err := authz.Self(ctx, uint(param.ID)); err != nil {
		return &api.DepositCasinoBalanceForbidden{Message: api.NewOptString(err.Error())}, nil
	}

	err := h.service.DepositCasinoBalance(uint(param.ID), req.Balance)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrInvalidAmount):
			return &api.DepositCasinoBalanceBadRequest{Message: api.NewOptString(err.Error())}, nil
		case errors.Is(err, service.ErrUserNotFound):
			return &api.DepositCasinoBalanceNotFound{Message: api.NewOptString(err.Error())}, nil

		default:
			return &api.DepositCasinoBalanceInternalServerError{Message: api.NewOptString(err.Error())}, nil
		}
	}

	return &api.DepositCasinoBalanceNoContent{}, nil
}

func (h *CasinoHandler) GetCasinoBalance(ctx context.Context, param api.GetCasinoBalanceParams) (api.GetCasinoBalanceRes, error) {
	if err := authz.Self(ctx, uint(param.ID)); err != nil {
		return &api.GetCasinoBalanceForbidden{Message: api.NewOptString(err.Error())}, nil
	}

	balance, err := h.service.GetCasinoBalance(uint(param.ID))
	if err != nil {
		switch {
		case errors.Is(err, service.ErrNoUserID):
			return &api.GetCasinoBalanceBadRequest{Message: api.NewOptString(err.Error())}, nil
		case errors.Is(err, service.ErrUserNotFound):
			return &api.GetCasinoBalanceNotFound{Message: api.NewOptString(err.Error())}, nil
		default:
			return &api.GetCasinoBalanceInternalServerError{Message: api.NewOptString(err.Error())}, nil
		}
	}

	return &api.Balance{Balance: balance}, nil
}

func (h *CasinoHandler) UpdateCasinoBalance(ctx context.Context, req *api.Balance, param api.UpdateCasinoBalanceParams) (api.UpdateCasinoBalanceRes, error) {
	if err := authz.Self(ctx, uint(param.ID)); err != nil {
		return &api.UpdateCasinoBalanceForbidden{Message: api.NewOptString(err.Error())}, nil
	}

	err := h.service.UpdateCasinoBalance(uint(param.ID), req.Balance)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrNoUserID),
			errors.Is(err, service.ErrInvalidAmount):
			return &api.UpdateCasinoBalanceBadRequest{Message: api.NewOptString(err.Error())}, nil

		case errors.Is(err, service.ErrUserNotFound):
			return &api.UpdateCasinoBalanceNotFound{Message: api.NewOptString(err.Error())}, nil

		case errors.Is(err, service.ErrInsufficientBalance):
			return &api.UpdateCasinoBalanceConflict{Message: api.NewOptString(err.Error())}, nil
		default:
			return &api.UpdateCasinoBalanceInternalServerError{Message: api.NewOptString(err.Error())}, nil
		}
	}

	return &api.UpdateCasinoBalanceNoContent{}, nil
}
