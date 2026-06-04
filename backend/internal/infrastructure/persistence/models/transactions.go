package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Transaction struct {
	ID               []byte `gorm:"type:binary(16);primaryKey"`
	SenderID         int64  `gorm:"index"`
	SenderUsername   string `gorm:"column:sender_username"`
	ReceiverID       int64
	ReceiverUsername string `gorm:"column:receiver_username"`
	Amount           float64
	Type             string
	Status           string
	CreatedAt        time.Time
	CompletedAt      *time.Time
}

func (t *Transaction) BeforeCreate(tx *gorm.DB) error {
	if len(t.ID) == 0 {
		u := uuid.New()
		t.ID = u[:]
	}

	return nil
}
