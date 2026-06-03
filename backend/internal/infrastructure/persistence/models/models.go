package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Account struct {
	gorm.Model
	Balance    int64     `gorm:"column:balance"`
	DailyClaim time.Time `gorm:"column:daily_claim"`
}

type AccountDiscordLink struct {
	AccountID     uint      `gorm:"column:account_id;primaryKey"`
	DiscordUserID string    `gorm:"column:discord_user_id;primaryKey"`
	LinkedAt      time.Time `gorm:"column:linked_at"`

	Account     Account     `gorm:"foreignKey:AccountID"`
	DiscordUser DiscordUser `gorm:"foreignKey:DiscordUserID"`
}

func (AccountDiscordLink) TableName() string {
	return "account_discord_links"
}

type CasinoAccount struct {
	gorm.Model
	ID        uint `gorm:"column:id;primaryKey"`
	AccountID uint `gorm:"column:account_id"`
	Balance   int64
}

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

type DiscordUser struct {
	gorm.Model
	DiscordId    string  `gorm:"column:discord_id;size:255"`
	PasswordHash string  `gorm:"column:password_hash;size:255"`
	Language     *string `gorm:"column:language;size:255;default:en"`
	Autofill     *int    `gorm:"column:autofill;default:0"`
}

type LinkAccountCode struct {
	ID uint `gorm:"primaryKey"`

	AccountID uint   `gorm:"column:account_id;not null;index"`
	Code      string `gorm:"column:code;not null;"`

	ExpiresAt time.Time  `gorm:"column:expires_at;not null;index"`
	UsedAt    *time.Time `gorm:"column:used_at"`

	CreatedAt time.Time
}

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

type User struct {
	gorm.Model
	Email        string `gorm:"column:email;size:255"`
	Username     string `gorm:"column:username;size:255"`
	PasswordHash string `gorm:"column:password_hash;size:255"`

	AccountID int64
	Account   Account
}
