package service

import (
	"backend/api"
	"backend/repository"
	"backend/repository/model"
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
	repo *repository.UserRepository
}

func NewUserService(repo *repository.UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) CreateUser(newUser *api.CreateUserData) (*api.User, error) {
	// Check if fields are empty
	fields := map[string]string{
		"email":    newUser.Email,
		"username": newUser.Username,
	}

	for _, v := range fields {
		if strings.TrimSpace(v) == "" {
			return nil, ErrUserCreateEmptyFields
		}
	}

	// Map User to model and check if password is valid
	user := s.MapUserToModel(newUser)
	if pw := newUser.Password; pw != "" && utf8.RuneCountInString(pw) >= 8 {
		hashedPassword, err := HashPassword(pw)
		if err != nil {
			return nil, ErrPasswordNotHashed
		}
		user.PasswordHash = string(hashedPassword)
	} else {
		return nil, ErrInvalidPassword
	}

	// check if user save passed
	createdUser, err := s.repo.SaveUser(user)
	if err != nil {
		if isUniqueConstraintError(err) {
			return nil, ErrUniqueConstraint
		}
		return nil, err
	}

	return s.MapModelToApiUser(createdUser), nil
}

func (s *UserService) GetUserById(userId uint) (*api.User, error) {
	user, err := s.repo.GetUserById(userId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}
	}

	return s.MapModelToApiUser(user), nil
}

func (s *UserService) GetUserBalanceById(userId uint) (*api.Balance, error) {
	account, err := s.repo.GetUserBalanceById(userId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}

	return s.MapAccountToBalance(account), nil
}

func (s *UserService) UpdateUserBalanceById(userId uint, delta int64) (*api.Balance, error) {
	account, err := s.repo.UpdateUserBalanceById(userId, delta)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}

		return nil, err
	}

	return s.MapAccountToBalance(account), nil
}

func (s *UserService) CreateLinkAccountCode(accountId int) (*api.LinkCode, error) {
	var linkModel model.LinkAccountCode

	if accountId < 1 {
		return nil, ErrInvalidAccountId
	}

	if _, err := s.GetUserById(uint(accountId)); err != nil {
		return nil, err
	}

	code, err := generateCode()
	if err != nil {
		return nil, ErrGeneratingCode
	}

	linkModel = model.LinkAccountCode{
		AccountID: uint(accountId),
		Code:      code,
		ExpiresAt: time.Now().Add(15 * time.Minute),
	}

	if _, err := s.repo.CreateLinkAccountCode(&linkModel); err != nil {
		if errors.Is(err, gorm.ErrInvalidTransaction) {
			return nil, ErrFailedDBTransaction
		}

		return nil, err
	}

	return &api.LinkCode{Code: code}, nil
}

func (s *UserService) MapAccountToBalance(account *model.Account) *api.Balance {
	return &api.Balance{
		Balance: account.Balance,
	}
}

func (s *UserService) MapUserToModel(newUser *api.CreateUserData) *model.User {
	return &model.User{
		Email:    newUser.Email,
		Username: newUser.Username,
	}
}

func (s *UserService) MapModelToApiUser(model *model.User) *api.User {
	return &api.User{
		ID:       int(model.ID),
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
