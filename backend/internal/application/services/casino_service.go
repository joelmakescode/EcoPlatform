package service

import (
	"backend/api"
	"backend/internal/application/ports"
	"backend/internal/domain"
	"backend/internal/infrastructure/game/rolladice"
	"context"
	"errors"

	"gorm.io/gorm"
)

type CasinoService struct {
	casinoRepository ports.CasinoRepository
	notifier         ports.Notifier
	userRepository   ports.UserRepository

	game *rolladice.RollADiceHandler
}

func NewCasinoService(casinoRepository ports.CasinoRepository, notifier ports.Notifier, userRepository ports.UserRepository) *CasinoService {
	return &CasinoService{casinoRepository: casinoRepository, notifier: notifier, userRepository: userRepository}
}

func (s *CasinoService) SetGame(game *rolladice.RollADiceHandler) {
	s.game = game
}

func (s *CasinoService) CashoutCasinoBalance(ctx context.Context, userId uint, amount int64) error {
	if amount <= 0 {
		return domain.ErrInvalidAmount
	}

	casinoAccount, err := s.casinoRepository.GetCasinoAccountById(ctx, userId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return domain.ErrUserNotFound
		}

		return err
	}

	if casinoAccount.Balance < amount {
		return domain.ErrInsufficientBalance
	}

	err = s.casinoRepository.UpdateCasinoAccountBalance(ctx, userId, -amount)
	if err != nil {
		return err
	}

	_, err = s.userRepository.UpdateUserBalance(ctx, userId, amount)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return domain.ErrUserNotFound
		}

		return err
	}

	s.notifier.NotifyUserRefresh(userId)

	return nil
}

func (s *CasinoService) CreateBetRollADice(ctx context.Context, userId uint, bets api.BetRollADiceBets) error {
	if s.game == nil {
		return domain.ErrGameNotInitialized
	}

	var totalBet int64 = 0

	for key, amount := range bets {
		if amount <= 0 {
			return domain.ErrInvalidStake
		}

		_, exists := domain.BetMultipliers[domain.BetKey(key)]
		if !exists {
			return domain.ErrStakeOptionDoesntExist
		}

		totalBet += amount
	}

	casinoAccount, err := s.casinoRepository.GetCasinoAccountById(ctx, userId)
	if err != nil {
		return err
	}

	if casinoAccount.Balance < totalBet {
		return domain.ErrInsufficientBalance
	}

	casinoAccount.Balance -= totalBet
	if err = s.casinoRepository.UpdateCasinoAccount(ctx, casinoAccount); err != nil {
		return err
	}
	s.game.SendCurrentBalance(userId, casinoAccount.Balance)

	currentRoundId := s.game.GetCurrentRoundId()

	return s.casinoRepository.CreateBet(ctx, userId, currentRoundId, bets)
}

func (s *CasinoService) GetCasinoBalance(ctx context.Context, userId uint) (int64, error) {
	account, err := s.casinoRepository.GetCasinoAccountById(ctx, userId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return 0, domain.ErrUserNotFound
		}

		return 0, err
	}

	return account.Balance, nil
}

func (s *CasinoService) DepositCasinoBalance(ctx context.Context, userId uint, amount int64) error {
	return s.UpdateCasinoBalance(ctx, userId, amount)
}

func (s *CasinoService) UpdateCasinoBalance(ctx context.Context, userId uint, amount int64) error {
	if amount <= 0 {
		return domain.ErrInvalidAmount
	}

	account, err := s.userRepository.GetUserBalance(ctx, userId)
	if err != nil {
		return err
	}

	if account.Balance < amount {
		return domain.ErrInsufficientBalance
	}

	err = s.casinoRepository.UpdateCasinoAccountBalance(ctx, userId, amount)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return domain.ErrUserNotFound
		}

		return err
	}

	_, err = s.userRepository.UpdateUserBalance(ctx, userId, -amount)
	if err != nil {
		return err
	}

	balance, _ := s.GetCasinoBalance(ctx, userId)
	s.game.SendCurrentBalance(userId, balance)
	s.notifier.NotifyUserRefresh(userId)

	return nil
}
