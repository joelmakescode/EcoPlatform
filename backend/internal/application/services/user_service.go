package services

import (
	"backend/generated"
	"backend/internal/application/ports"
	"backend/internal/domain"
	"backend/internal/infrastructure/persistence/models"
	"backend/internal/infrastructure/persistence/repository"
	"backend/internal/infrastructure/security"
	"crypto/rand"
	"fmt"
	"math/big"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/go-faster/errors"
	"gorm.io/gorm"
)

type UserService struct {
	repo     *repository.UserRepository
	notifier ports.Notifier
}

func NewUserService(repo *repository.UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) SetNotifier(notifier ports.Notifier) {
	s.notifier = notifier
}

func (s *UserService) ClaimDaily(userId uint) error {
	if userId <= 0 {
		return domain.ErrNoUserID
	}

	ok, err := s.GetDailyClaimStatus(userId)
	if err != nil {
		return err
	}

	if !ok {
		return domain.ErrDailyAlreadyClaimed
	}

	_, err = s.UpdateUserBalanceById(userId, int64(50))
	if err != nil {
		return err
	}

	err = s.repo.ClaimDaily(userId)
	if err != nil {
		return err
	}

	if s.notifier != nil {
		s.notifier.NotifyUserRefresh(userId)
	}

	return nil
}

func (s *UserService) CreateUser(newUser *api.CreateUserData) (*api.User, error) {
	// Check if fields are empty
	fields := map[string]string{
		"email":    newUser.Email,
		"username": newUser.Username,
	}

	for _, v := range fields {
		if strings.TrimSpace(v) == "" {
			return nil, domain.ErrUserCreateEmptyFields
		}
	}

	// Map User to model and check if password is valid
	user := s.MapUserToModel(newUser)
	if pw := newUser.Password; pw != "" && utf8.RuneCountInString(pw) >= 8 {
		hashedPassword, err := security.Hash(pw)
		if err != nil {
			return nil, domain.ErrPasswordNotHashed
		}
		user.PasswordHash = string(hashedPassword)
	} else {
		return nil, domain.ErrInvalidPassword
	}

	// check if user save passed
	createdUser, err := s.repo.SaveUser(user)
	if err != nil {
		if errors.Is(err, gorm.ErrDuplicatedKey) {
			return nil, domain.ErrUniqueConstraint
		}
		return nil, err
	}

	return s.MapModelToApiUser(createdUser), nil
}

func (s *UserService) GetDailyClaimStatus(userId uint) (bool, error) {
	account, err := s.repo.GetUserAccount(userId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, domain.ErrUserNotFound
		}

		return false, err
	}

	next := account.DailyClaim.Add(24 * time.Hour)
	remaining := time.Until(next)

	if remaining > 0 {
		return false, nil
	}

	return true, nil
}

func (s *UserService) GetUserById(userId uint) (*api.User, error) {
	user, err := s.repo.GetUserById(userId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, domain.ErrUserNotFound
		}
	}

	return s.MapModelToApiUser(user), nil
}

func (s *UserService) GetUserBalanceById(userId uint) (*api.Balance, error) {
	account, err := s.repo.GetUserBalanceById(userId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, domain.ErrUserNotFound
		}
		return nil, err
	}

	return s.MapAccountToBalance(account), nil
}

func (s *UserService) UpdateUserBalanceById(userId uint, delta int64) (*api.Balance, error) {
	account, err := s.repo.UpdateUserBalanceById(userId, delta)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, domain.ErrUserNotFound
		}

		return nil, err
	}

	if s.notifier != nil {
		s.notifier.NotifyUserRefresh(userId)
	}

	return s.MapAccountToBalance(account), nil
}

func (s *UserService) CreateLinkAccountCode(accountId int) (*api.LinkCode, error) {
	var linkModel models.LinkAccountCode

	if accountId < 1 {
		return nil, domain.ErrInvalidAccountId
	}

	if _, err := s.GetUserById(uint(accountId)); err != nil {
		return nil, err
	}

	code, err := generateCode()
	if err != nil {
		return nil, domain.ErrGeneratingCode
	}

	linkModel = models.LinkAccountCode{
		AccountID: uint(accountId),
		Code:      code,
		ExpiresAt: time.Now().Add(15 * time.Minute),
	}

	if _, err := s.repo.CreateLinkAccountCode(&linkModel); err != nil {
		if errors.Is(err, gorm.ErrInvalidTransaction) {
			return nil, domain.ErrFailedDBTransaction
		}

		return nil, err
	}

	return &api.LinkCode{Code: code}, nil
}

func (s *UserService) MapAccountToBalance(account *models.Account) *api.Balance {
	return &api.Balance{
		Balance: account.Balance,
	}
}

func (s *UserService) MapUserToModel(newUser *api.CreateUserData) *models.User {
	return &models.User{
		Email:    newUser.Email,
		Username: newUser.Username,
	}
}

func (s *UserService) MapModelToApiUser(model *models.User) *api.User {
	return &api.User{
		ID:       int(model.AccountID),
		Email:    model.Email,
		Username: model.Username,
	}
}

func generateCode() (string, error) {
	n, err := rand.Int(rand.Reader, big.NewInt(1_000_000))
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%06d", n.Int64()), nil
}
