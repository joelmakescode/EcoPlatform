package service

import (
	"backend/internal/application/dto"
	"backend/internal/application/ports"
	"backend/internal/domain"
	"context"
	"crypto/rand"
	"fmt"
	"math/big"
	"time"

	"github.com/go-faster/errors"
	"gorm.io/gorm"
)

type UserService struct {
	notifier       ports.Notifier
	passwordHasher ports.PasswordHasher
	userRepository ports.UserRepository
}

func NewUserService(notifier ports.Notifier, passwordHasher ports.PasswordHasher, userRepository ports.UserRepository) *UserService {
	return &UserService{notifier: notifier, passwordHasher: passwordHasher, userRepository: userRepository}
}

func (s *UserService) ClaimDaily(ctx context.Context, userId uint) error {
	ok, err := s.GetDailyClaimStatus(ctx, userId)
	if err != nil {
		return err
	}

	if !ok {
		return domain.ErrDailyAlreadyClaimed
	}

	_, err = s.UpdateUserBalance(ctx, userId, 5000)
	if err != nil {
		return err
	}

	err = s.userRepository.ClaimDaily(ctx, userId)
	if err != nil {
		return err
	}

	if s.notifier != nil {
		err := s.notifier.NotifyUserRefresh(userId)
		if err != nil {
			return err
		}
	}

	return nil
}

func (s *UserService) CreateUser(ctx context.Context, input *dto.CreateUserInput) (*dto.CreateUserOutput, error) {
	if input.Email == "" || input.Username == "" {
		return nil, domain.ErrUserCreateEmptyFields
	}

	if len(input.Password) < 8 {
		return nil, domain.ErrWeakPassword
	}

	hashedPassword, err := s.passwordHasher.Hash(input.Password)
	if err != nil {
		return nil, domain.ErrPasswordNotHashed
	}

	user := domain.User{
		Email:        input.Email,
		Username:     input.Username,
		PasswordHash: hashedPassword,
	}

	if err := s.userRepository.SaveUser(ctx, &user); err != nil {
		return nil, domain.ErrUniqueConstraint
	}

	return &dto.CreateUserOutput{
		ID:       user.ID,
		Email:    user.Email,
		Username: user.Username,
	}, nil
}

func (s *UserService) GetDailyClaimStatus(ctx context.Context, userId uint) (bool, error) {
	account, err := s.userRepository.GetUserAccount(ctx, userId)
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

func (s *UserService) GetUserById(ctx context.Context, userId uint) (*dto.UserOutput, error) {
	user, err := s.userRepository.GetUser(ctx, userId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, domain.ErrUserNotFound
		}
	}

	return &dto.UserOutput{
		ID:       user.ID,
		Email:    user.Email,
		Username: user.Username,
	}, nil
}

func (s *UserService) GetUserBalance(ctx context.Context, userId uint) (*dto.BalanceOutput, error) {
	account, err := s.userRepository.GetUserAccount(ctx, userId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, domain.ErrUserNotFound
		}
		return nil, err
	}

	return &dto.BalanceOutput{Balance: account.Balance}, nil
}

func (s *UserService) UpdateUserBalance(ctx context.Context, userId uint, delta int64) (*dto.BalanceOutput, error) {
	account, err := s.userRepository.UpdateUserBalance(ctx, userId, delta)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, domain.ErrUserNotFound
		}

		return nil, err
	}

	if s.notifier != nil {
		err := s.notifier.NotifyUserRefresh(userId)
		if err != nil {
			return nil, err
		}
	}

	return &dto.BalanceOutput{Balance: account.Balance}, nil
}

func (s *UserService) CreateLinkAccountCode(ctx context.Context, accountId uint) (*dto.LinkCodeOutput, error) {
	if _, err := s.GetUserById(ctx, accountId); err != nil {
		return nil, err
	}

	code, err := generateCode()
	if err != nil {
		return nil, domain.ErrGeneratingCode
	}

	linkModel := domain.LinkAccountCode{
		AccountID: accountId,
		Code:      code,
		ExpiresAt: time.Now().Add(15 * time.Minute),
	}

	if err := s.userRepository.CreateLinkAccountCode(ctx, &linkModel); err != nil {
		if errors.Is(err, gorm.ErrInvalidTransaction) {
			return nil, domain.ErrFailedDBTransaction
		}

		return nil, err
	}

	return &dto.LinkCodeOutput{Code: code}, nil
}

func generateCode() (string, error) {
	n, err := rand.Int(rand.Reader, big.NewInt(1_000_000))
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%06d", n.Int64()), nil
}
