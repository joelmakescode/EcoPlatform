package security

import (
	"backend/internal/domain"
	"regexp"
)

type Validator struct{}

func NewValidator() *Validator {
	return &Validator{}
}

func (v *Validator) ValidateEmail(email string) error {
	const emailRegex = `^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`
	if !regexp.MustCompile(emailRegex).MatchString(email) {
		return domain.ErrInvalidEmail
	}
	return nil
}

func (v *Validator) ValidatePassword(password string) error {
	if len(password) < 8 {
		return domain.ErrWeakPassword
	}
	return nil
}
