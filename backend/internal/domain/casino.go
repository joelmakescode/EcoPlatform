package domain

import "time"

type DiceRound struct {
	ID        int64
	Dice1     int
	Dice2     int
	CreatedAt time.Time
}

type DiceBet struct {
	ID        int64
	UserID    uint
	Amount    int64
	BetKey    string
	RoundID   int64
	CreatedAt time.Time
}
