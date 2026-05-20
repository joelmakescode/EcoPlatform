package service

import (
	"backend/api"
	"backend/events"
	"backend/game/rolladice"
	"backend/repository"
	"backend/repository/model"
	"errors"

	"gorm.io/gorm"
)

type CasinoService struct {
	notifier events.Notifier
	repo     *repository.CasinoRepository
	userRepo *repository.UserRepository
	game     *rolladice.RollADiceHandler
}

func NewCasinoService(repo *repository.CasinoRepository, userRepo *repository.UserRepository) *CasinoService {
	return &CasinoService{repo: repo, userRepo: userRepo}
}

func (s *CasinoService) SetGame(game *rolladice.RollADiceHandler) {
	s.game = game
}

func (s *CasinoService) SetNotifier(notifier events.Notifier) {
	s.notifier = notifier
}

func (s *CasinoService) CashoutCasinoBalance(userId uint, amount int64) error {
	if amount <= 0 {
		return ErrInvalidAmount
	}

	casinoAccount, err := s.repo.GetCasinoAccountById(userId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrUserNotFound
		}

		return err
	}

	if casinoAccount.Balance < amount {
		return ErrInsufficientBalance
	}

	err = s.repo.UpdateCasinoAccountBalance(userId, -amount)
	if err != nil {
		return err
	}

	_, err = s.userRepo.UpdateUserBalanceById(userId, amount)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrUserNotFound
		}

		return err
	}

	s.notifier.NotifyUserRefresh(userId)

	return nil
}

func (s *CasinoService) CreateBetRollADice(userId uint, bets api.BetRollADiceBets) error {
	if s.game == nil {
		panic("game not initialized")
	}

	var totalBet int64 = 0

	for key, amount := range bets {
		if amount <= 0 {
			return ErrInvalidStake
		}

		_, exists := model.BetsMultiplies[key]
		if !exists {
			return ErrStakeOptionDoesntExist
		}

		totalBet += amount
	}

	casinoAccount, err := s.repo.GetCasinoAccountById(userId)
	if err != nil {
		return err
	}

	if casinoAccount.Balance < totalBet {
		return ErrInsufficientBalance
	}

	casinoAccount.Balance -= totalBet
	if err = s.repo.UpdateCasinoAccount(casinoAccount); err != nil {
		return err
	}
	s.game.SendCurrentBalance(userId, casinoAccount.Balance)

	currentRoundId := s.game.GetCurrentRoundId()

	return s.repo.CreateBet(userId, currentRoundId, bets)
}

func (s *CasinoService) GetCasinoBalance(userId uint) (int64, error) {
	if userId == 0 {
		return 0, ErrNoUserID
	}

	account, err := s.repo.GetCasinoAccountById(userId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return 0, ErrUserNotFound
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
		return ErrInvalidAmount
	}

	account, err := s.userRepo.GetUserBalanceById(userId)
	if err != nil {
		return err
	}

	if account.Balance < amount {
		return ErrInsufficientBalance
	}

	err = s.repo.UpdateCasinoAccountBalance(userId, amount)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrUserNotFound
		}

		return err
	}

	_, err = s.userRepo.UpdateUserBalanceById(userId, -amount)
	if err != nil {
		return err
	}

	balance, _ := s.GetCasinoBalance(userId)
	s.game.SendCurrentBalance(userId, balance)
	s.notifier.NotifyUserRefresh(userId)

	return nil
}
