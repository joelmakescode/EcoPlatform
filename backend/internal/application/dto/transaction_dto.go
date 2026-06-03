package dto

import (
	"backend/internal/domain"
	"time"
)

type CreateTransactionInput struct {
	SenderUsername   string                 `json:"sender_username"`
	ReceiverUsername string                 `json:"receiver_username"`
	Amount           int64                  `json:"amount"`
	Type             domain.TransactionType `json:"type"`
}

type GetTransactionsInput struct {
	UserID uint    `json:"id"`
	Limit  int     `json:"limit"`
	Cursor *string `json:"cursor"`
}

type TransactionOutput struct {
	ID               string                   `json:"id"`
	SenderID         uint                     `json:"sender_id"`
	SenderUsername   string                   `json:"sender_username"`
	ReceiverID       uint                     `json:"receiver_id"`
	ReceiverUsername string                   `json:"receiver_username"`
	Amount           int64                    `json:"amount"`
	Type             domain.TransactionType   `json:"type"`
	Status           domain.TransactionStatus `json:"status"`
	CreatedAt        time.Time                `json:"created_at"`
	CompletedAt      *time.Time               `json:"completed_at,omitempty"`
}
