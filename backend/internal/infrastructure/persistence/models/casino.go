package models

import "time"

type DiceRoundTable struct {
	ID        int64 `gorm:"primaryKey"`
	Dice1     int
	Dice2     int
	CreatedAt time.Time
	TableName string `gorm:"table:dice_rounds"`
}

type DiceBetTable struct {
	ID        int64 `gorm:"primaryKey"`
	UserID    uint
	Amount    int64
	BetKey    string
	RoundID   int64
	CreatedAt time.Time
	TableName string `gorm:"table:dice_bets"`
}
