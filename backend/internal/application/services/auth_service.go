package service

import (
	"backend/internal/application/ports"
	"backend/internal/domain"
	"backend/internal/infrastructure/http/middleware"
	"backend/internal/infrastructure/security"
	"context"

	"github.com/go-faster/errors"
	"gorm.io/gorm"
)

type AuthService struct {
	jwtService     *security.JWTService
	userRepository ports.UserRepository
}

func NewAuthService(jwtService *security.JWTService, userRepository ports.UserRepository) *AuthService {
	return &AuthService{jwtService: jwtService, userRepository: userRepository}
}

func (s *AuthService) Login(ctx context.Context, email, password string) (string, error) {
	if email == "" || password == "" {
		return "", domain.ErrInvalidEmailOrPassword
	}

	user, err := s.userRepository.GetUserByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return "", domain.ErrUserNotFound
		}
		return "", err
	}

	valid := ValidatePasswordToHash([]byte(password), []byte(user.PasswordHash))
	if !valid {
		return "", domain.ErrInvalidPassword
	}

	token, err := middleware.GenerateJWTToken(user.ID)
	if err != nil {
		return "", domain.ErrCantGenerateJWTToken
	}

	return token, nil
}
