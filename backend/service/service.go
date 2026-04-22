package service

import (
	"strings"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"errors"
)

var (
	ErrCantGenerateJWTToken       = errors.New("couldn't generate JWT Token")
	ErrInvalidEmailOrPassword     = errors.New("invalid Email or Password")
	ErrInvalidPassword            = errors.New("invalid Password")
	ErrPasswordNotHashed          = errors.New("password couldn't be hashed")
	ErrUniqueConstraint           = errors.New("unique Constraint - Duplicate Entry")
	ErrUserCreateEmptyFields      = errors.New("email or Username field empty")
	ErrUserNotFound               = errors.New("user not found")
	ErrNoDiscordUserID            = errors.New("no Discord User Id Given")
	ErrInvalidDiscordIdOrPassword = errors.New("invalid Discord Id or Password")
	ErrInvalidLanguage            = errors.New("invalid language")
	ErrFailedDBTransaction        = errors.New("failed db transaction")
	ErrGeneratingCode             = errors.New("error generating code")
	ErrInvalidAccountId           = errors.New("invalid Account Id")
	ErrNoEntryFoundForCode        = errors.New("no entry found for code")
	ErrInvalidCode                = errors.New("invalid code")
	ErrCodeExpired                = errors.New("code expired")
	ErrCodeUsed                   = errors.New("code already used")
)

func HashPassword(password string) ([]byte, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	return hash, nil
}

func ValidatePasswordToHash(input []byte, hashedPassword []byte) bool {
	err := bcrypt.CompareHashAndPassword(hashedPassword, input)
	if err != nil {
		return false
	}

	return true
}

func isUniqueConstraintError(err error) bool {
	if err == nil {
		return false
	}

	if errors.Is(err, gorm.ErrDuplicatedKey) {
		return true
	}

	msg := strings.ToLower(err.Error())

	return strings.Contains(msg, "unique") || strings.Contains(msg, "duplicate key") || strings.Contains(msg, "duplicate entry")
}
