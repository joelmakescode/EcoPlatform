package handler

import (
	"backend/api"
	"backend/handler/authz"
	"backend/repository/model"
	"backend/service"
	"context"
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TransactionHandler struct {
	service *service.TransactionService
}

func NewTransactionHandler(service *service.TransactionService) *TransactionHandler {
	return &TransactionHandler{service: service}
}

func (h *TransactionHandler) CreateTransaction(ctx context.Context, req *api.CreateTransaction) (api.CreateTransactionRes, error) {
	tx, err := h.service.CreateTransaction(ctx, req.SenderUsername, req.ReceiverUsername, req.Amount, string(req.Type))
	if err != nil {
		switch {
		case errors.Is(err, service.ErrSameUser),
			errors.Is(err, service.ErrInsufficientBalance),
			errors.Is(err, service.ErrInvalidTransactionType),
			errors.Is(err, service.ErrNoUsername):
			return &api.CreateTransactionBadRequest{Message: api.NewOptString(err.Error())}, nil

		case errors.Is(err, authz.ErrForbidden):
			return &api.CreateTransactionForbidden{Message: api.NewOptString(err.Error())}, nil

		case errors.Is(err, service.ErrUserNotFound):
			return &api.CreateTransactionNotFound{Message: api.NewOptString(err.Error())}, nil

		default:
			return &api.CreateTransactionInternalServerError{Message: api.NewOptString(err.Error())}, nil
		}
	}

	return mapTransaction(tx), nil
}

func (h *TransactionHandler) GetTransactions(ctx context.Context, params api.GetTransactionsParams) (api.GetTransactionsRes, error) {
	limit := 50
	if params.Limit.Set {
		limit = params.Limit.Value
	}

	var cursor *string
	if params.Cursor.Set {
		cursor = &params.Cursor.Value
	}

	txs, nextCursor, hasMore, err := h.service.GetUserTransactionsById(ctx, int64(params.ID), limit, cursor)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrNoUserID):
			return &api.GetTransactionsBadRequest{Message: api.NewOptString(err.Error())}, nil
		case errors.Is(err, authz.ErrForbidden):
			return &api.GetTransactionsForbidden{Message: api.NewOptString(err.Error())}, nil
		case errors.Is(err, service.ErrUserNotFound):
			return &api.GetTransactionsNotFound{Message: api.NewOptString(err.Error())}, nil
		default:
			return &api.GetTransactionsInternalServerError{Message: api.NewOptString(err.Error())}, nil
		}
	}

	var next api.OptNilString
	if nextCursor != nil {
		next = api.NewOptNilString(*nextCursor)
	}

	resp := &api.Transactions{
		ID:           int(params.ID),
		Transactions: mapTransactions(txs),
		Pagination: api.TransactionPagination{
			Limit:      limit,
			NextCursor: next,
			HasMore:    hasMore,
		},
	}

	return resp, nil
}

func (h *TransactionHandler) AcceptTransaction(ctx context.Context, param api.AcceptTransactionParams) (api.AcceptTransactionRes, error) {
	if err := h.service.AcceptTransaction(ctx, param.ID); err != nil {
		switch {
		case errors.Is(err, service.ErrInvalidUUID),
			errors.Is(err, service.ErrInsufficientBalance):
			return &api.AcceptTransactionBadRequest{Message: api.NewOptString(err.Error())}, nil

		case errors.Is(err, gorm.ErrRecordNotFound):
			return &api.AcceptTransactionNotFound{Message: api.NewOptString(err.Error())}, nil

		default:
			return &api.AcceptTransactionInternalServerError{Message: api.NewOptString(err.Error())}, nil
		}
	}

	return &api.AcceptTransactionNoContent{}, nil
}

func (h *TransactionHandler) CancelTransaction(ctx context.Context, param api.CancelTransactionParams) (api.CancelTransactionRes, error) {
	if err := h.service.CancelTransaction(ctx, param.ID); err != nil {
		switch {
		case errors.Is(err, service.ErrInvalidUUID):
			return &api.CancelTransactionBadRequest{Message: api.NewOptString(err.Error())}, nil

		default:
			return &api.CancelTransactionInternalServerError{Message: api.NewOptString(err.Error())}, nil
		}
	}

	return &api.CancelTransactionNoContent{}, nil
}

func (h *TransactionHandler) RefundTransaction(ctx context.Context, param api.RefundTransactionParams) (api.RefundTransactionRes, error) {
	if err := h.service.RefundTransaction(ctx, param.ID); err != nil {
		switch {
		case errors.Is(err, service.ErrInvalidUUID):
			return &api.RefundTransactionBadRequest{Message: api.NewOptString(err.Error())}, nil
		default:
			return &api.RefundTransactionInternalServerError{Message: api.NewOptString(err.Error())}, nil
		}
	}

	return &api.RefundTransactionNoContent{}, nil
}

func (h *TransactionHandler) RejectTransaction(ctx context.Context, param api.RejectTransactionParams) (api.RejectTransactionRes, error) {
	if err := h.service.RejectTransaction(ctx, param.ID); err != nil {
		switch {
		case errors.Is(err, service.ErrInvalidUUID):
			return &api.RejectTransactionBadRequest{Message: api.NewOptString(err.Error())}, nil

		default:
			return &api.RejectTransactionInternalServerError{Message: api.NewOptString(err.Error())}, nil
		}
	}

	return &api.RejectTransactionNoContent{}, nil
}

func mapTransactions(txs []model.Transaction) []api.Transaction {
	out := make([]api.Transaction, 0, len(txs))

	for _, tx := range txs {
		uuidVal, err := uuid.FromBytes(tx.ID)
		if err != nil {
			panic("invalid uuid bytes")
		}

		out = append(out, api.Transaction{
			ID:               api.TransactionID(uuidVal),
			SenderID:         int(tx.SenderID),
			SenderUsername:   tx.SenderUsername,
			ReceiverID:       int(tx.ReceiverID),
			ReceiverUsername: tx.ReceiverUsername,
			Amount:           tx.Amount,
			Type:             api.TransactionType(tx.Type),
			Status:           api.TransactionStatus(tx.Status),
			CreatedAt:        tx.CreatedAt,
		})
	}

	return out
}

func mapTransaction(tx *model.Transaction) *api.Transaction {
	uuidVal, err := uuid.FromBytes(tx.ID)
	if err != nil {
		panic("invalid uuid bytes")
	}

	return &api.Transaction{
		ID:         api.TransactionID(uuidVal),
		SenderID:   int(tx.SenderID),
		ReceiverID: int(tx.ReceiverID),
		Amount:     tx.Amount,
		Type:       api.TransactionType(tx.Type),
		Status:     api.TransactionStatus(tx.Status),
		CreatedAt:  tx.CreatedAt,
	}
}
