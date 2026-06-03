package ports

import (
	"backend/internal/application/dto"
	"backend/internal/domain"
	"context"
)

type UserRepository interface {
	ClaimDaily(ctx context.Context, userId uint) error
	CreateLinkAccountCode(ctx context.Context, code *domain.LinkAccountCode) error

	GetUserByEmail(ctx context.Context, email string) (*domain.User, error)
	GetUser(ctx context.Context, id uint) (*domain.User, error)
	GetIdByUsername(ctx context.Context, username string) (uint, error)
	GetUserAccount(ctx context.Context, id uint) (*domain.Account, error)
	GetUserBalance(ctx context.Context, id uint) (*domain.Account, error)

	SaveUser(ctx context.Context, user *domain.User) error

	UpdateUserBalance(ctx context.Context, id uint, delta int64) (*domain.Account, error)
}

type TransactionRepository interface {
	CompleteTransaction(ctx context.Context, transactionID string, status domain.TransactionStatus) error
	Create(ctx context.Context, tx *domain.Transaction) error

	GetParticipantsFromTransaction(ctx context.Context, transactionID string) (uint, uint, int64, error)
	GetTransaction(ctx context.Context, id string) (*domain.Transaction, error)

	List(ctx context.Context, userID uint, limit int, cursor *domain.Cursor) ([]*dto.TransactionOutput, *domain.Cursor, error)
}

type CasinoRepository interface {
	CreateBet(ctx context.Context, userId uint, roundId int64, bets map[string]int64) error
	CreateRollADiceRound(ctx context.Context) (*domain.DiceRound, error)

	GetBetsByRound(ctx context.Context, roundID int64) ([]domain.DiceBet, error)
	GetCasinoAccountById(ctx context.Context, userId uint) (*domain.CasinoAccount, error)

	UpdateCasinoAccount(ctx context.Context, account *domain.CasinoAccount) error
	UpdateCasinoAccountBalance(ctx context.Context, userId uint, amount int64) error
	UpdateRollADiceRound(ctx context.Context, roundID int64, dice1, dice2 int) error
}
