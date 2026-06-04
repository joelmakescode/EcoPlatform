package services

import (
	"backend/internal/domain"
	"backend/internal/infrastructure/http/middleware"
	"backend/internal/infrastructure/persistence/repository"
	"backend/internal/infrastructure/security"
	"unicode/utf8"

	"github.com/go-faster/errors"
	"gorm.io/gorm"
)

type AuthService struct {
	repo *repository.UserRepository
}

func NewAuthService(repo *repository.UserRepository) *AuthService {
	return &AuthService{repo: repo}
}

func (s *AuthService) Login(email, password string) (string, error) {
	fields := map[string]string{
		"Email":    email,
		"Password": password,
	}

	for _, v := range fields {
		if v == "" || utf8.RuneCountInString(v) > 255 {
			return "", domain.ErrInvalidEmailOrPassword
		}
	}

	user, err := s.repo.GetUserByEmail(email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return "", domain.ErrUserNotFound
		}
		return "", err
	}

	valid := security.ValidatePasswordToHash([]byte(password), []byte(user.PasswordHash))
	if !valid {
		return "", domain.ErrInvalidPassword
	}

	token, err := middleware.GenerateJWTToken(user.ID)
	if err != nil {
		return "", domain.ErrCantGenerateJWTToken
	}

	return token, nil
}
