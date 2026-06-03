package models

import "time"

type UserTable struct {
	ID           uint   `gorm:"primaryKey"`
	Email        string `gorm:"uniqueIndex"`
	Username     string
	PasswordHash string
	Balance      int64
	CreatedAt    time.Time
	UpdatedAt    time.Time
	TableName    string `gorm:"table:users"`
}

type AccountTable struct {
	ID         uint `gorm:"primaryKey"`
	AccountID  uint
	Balance    int64
	DailyClaim time.Time
	CreatedAt  time.Time
	UpdatedAt  time.Time
	TableName  string `gorm:"table:accounts"`
}

type CasinoAccountTable struct {
	ID        uint `gorm:"primaryKey"`
	AccountID uint
	Balance   int64
	CreatedAt time.Time
	UpdatedAt time.Time
	TableName string `gorm:"table:casino_accounts"`
}

type LinkAccountCodeTable struct {
	ID        uint `gorm:"primaryKey"`
	AccountID uint
	Code      string
	ExpiresAt time.Time
	CreatedAt time.Time
	TableName string `gorm:"table:link_account_codes"`
}
