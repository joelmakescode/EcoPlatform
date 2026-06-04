package models

import "time"

type DiceBet struct {
	ID      int64 `gorm:"column:id;primaryKey"`
	UserID  uint  `gorm:"column:user_id"`
	RoundID int64 `gorm:"column:round_id"`

	BetKey    string    `gorm:"column:bet_key"`
	Amount    int64     `gorm:"column:amount"`
	CreatedAt time.Time `gorm:"column:created_at"`
}

type DiceRound struct {
	ID        int64     `gorm:"column:id;primaryKey"`
	Dice1     int       `gorm:"column:dice1"`
	Dice2     int       `gorm:"column:dice2"`
	CreatedAt time.Time `gorm:"column:created_at"`
}
