package domain

import (
	"time"

	"github.com/google/uuid"
)

type Cursor struct {
	CreatedAt time.Time
	ID        uuid.UUID
}

type Transaction struct {
	ID               []byte
	SenderID         uint
	SenderUsername   string
	ReceiverID       uint
	ReceiverUsername string
	Amount           int64
	Type             TransactionType
	Status           TransactionStatus
	CompletedAt      *time.Time
	CreatedAt        time.Time
	UpdatedAt        time.Time
}
