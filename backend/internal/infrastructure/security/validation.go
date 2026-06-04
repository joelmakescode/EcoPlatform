package security

import (
	"backend/internal/domain"
	"strings"
	"unicode/utf8"
)

func ValidateEmail(email string) error {
	if strings.TrimSpace(email) == "" {
		return domain.ErrInvalidEmailOrPassword
	}

	if !strings.Contains(email, "@") {
		return domain.ErrInvalidEmailOrPassword
	}

	return nil
}

func ValidatePassword(password string) error {
	if utf8.RuneCountInString(password) < 8 {
		return domain.ErrInvalidPassword
	}

	return nil
}

func ValidateUsername(username string) error {
	if utf8.RuneCountInString(username) > 15 || utf8.RuneCountInString(username) < 3 {
		return domain.ErrInvalidUsername
	}

	return nil
}
