package models

import "time"

type TransactionTable struct {
	ID               []byte `gorm:"primaryKey;type:binary(16)"`
	SenderID         int64
	SenderUsername   string
	ReceiverID       int64
	ReceiverUsername string
	Amount           float64
	Type             string
	Status           string
	CompletedAt      *time.Time
	CreatedAt        time.Time
	UpdatedAt        time.Time
	TableName        string `gorm:"table:transactions"`
}
