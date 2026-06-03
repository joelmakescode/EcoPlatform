package domain

import "time"

type User struct {
	ID           uint
	Email        string
	Username     string
	PasswordHash string
	Balance      int64 // Cents
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

type Account struct {
	ID         uint
	AccountID  uint
	Balance    int64
	DailyClaim time.Time
	CreatedAt  time.Time
	UpdatedAt  time.Time
}

type CasinoAccount struct {
	ID        uint
	AccountID uint
	Balance   int64
	CreatedAt time.Time
	UpdatedAt time.Time
}

type LinkAccountCode struct {
	ID        uint
	AccountID uint
	Code      string
	ExpiresAt time.Time
	CreatedAt time.Time
}
