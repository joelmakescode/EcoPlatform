package services

import (
	"backend/generated"
	"backend/internal/application/ports"
	"backend/internal/domain"
	"backend/internal/infrastructure/games"
	"backend/internal/infrastructure/persistence/repository"
	"errors"

	"gorm.io/gorm"
)

type CasinoService struct {
	notifier ports.Notifier
	repo     *repository.CasinoRepository
	userRepo *repository.UserRepository
	Game     *games.RollADiceHandler
}

func NewCasinoService(notifier ports.Notifier, repo *repository.CasinoRepository, userRepo *repository.UserRepository, game *games.RollADiceHandler) *CasinoService {
	return &CasinoService{notifier: notifier, repo: repo, userRepo: userRepo, Game: game}
}

func (s *CasinoService) CashoutCasinoBalance(userId uint, amount int64) error {
	if amount <= 0 {
		return domain.ErrInvalidAmount
	}

	casinoAccount, err := s.repo.GetCasinoAccountById(userId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return domain.ErrUserNotFound
		}

		return err
	}

	if casinoAccount.Balance < amount {
		return domain.ErrInsufficientBalance
	}

	err = s.repo.UpdateCasinoAccountBalance(userId, -amount)
	if err != nil {
		return err
	}

	_, err = s.userRepo.UpdateUserBalanceById(userId, amount)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return domain.ErrUserNotFound
		}

		return err
	}

	s.notifier.NotifyUserRefresh(userId)

	return nil
}

func (s *CasinoService) CreateBetRollADice(userId uint, bets api.BetRollADiceBets) error {
	if s.Game == nil {
		panic("game not initialized")
	}

	var totalBet int64 = 0

	for key, amount := range bets {
		if amount <= 0 {
			return domain.ErrInvalidStake
		}

		_, exists := domain.BetsMultipliers[key]
		if !exists {
			return domain.ErrStakeOptionDoesntExist
		}

		totalBet += amount
	}

	casinoAccount, err := s.repo.GetCasinoAccountById(userId)
	if err != nil {
		return err
	}

	if casinoAccount.Balance < totalBet {
		return domain.ErrInsufficientBalance
	}

	casinoAccount.Balance -= totalBet
	if err = s.repo.UpdateCasinoAccount(casinoAccount); err != nil {
		return err
	}
	s.Game.SendCurrentBalance(userId, casinoAccount.Balance)

	currentRoundId := s.Game.GetCurrentRoundId()

	return s.repo.CreateBet(userId, currentRoundId, bets)
}

func (s *CasinoService) GetCasinoBalance(userId uint) (int64, error) {
	if userId == 0 {
		return 0, domain.ErrNoUserID
	}

	account, err := s.repo.GetCasinoAccountById(userId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return 0, domain.ErrUserNotFound
		}

		return 0, err
	}

	return account.Balance, nil
}

func (s *CasinoService) DepositCasinoBalance(userId uint, amount int64) error {
	return s.UpdateCasinoBalance(userId, amount)
}

func (s *CasinoService) UpdateCasinoBalance(userId uint, amount int64) error {
	if amount <= 0 {
		return domain.ErrInvalidAmount
	}

	account, err := s.userRepo.GetUserBalanceById(userId)
	if err != nil {
		return err
	}

	if account.Balance < amount {
		return domain.ErrInsufficientBalance
	}

	err = s.repo.UpdateCasinoAccountBalance(userId, amount)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return domain.ErrUserNotFound
		}

		return err
	}

	_, err = s.userRepo.UpdateUserBalanceById(userId, -amount)
	if err != nil {
		return err
	}

	balance, _ := s.GetCasinoBalance(userId)
	s.Game.SendCurrentBalance(userId, balance)
	s.notifier.NotifyUserRefresh(userId)

	return nil
}
