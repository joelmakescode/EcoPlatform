package service

import (
	"strings"

	"gorm.io/gorm"

	"errors"
)

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
