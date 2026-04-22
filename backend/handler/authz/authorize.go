package authz

import (
	"context"
	"errors"
)

var (
	ErrUnauthenticated = errors.New("unauthenticated")
	ErrForbidden       = errors.New("forbidden")
)

func Self(ctx context.Context, resourceUserID uint) error {
	userID, ok := UserID(ctx)
	if !ok {
		return ErrUnauthenticated
	}

	if userID != resourceUserID {
		return ErrForbidden
	}

	return nil
}
