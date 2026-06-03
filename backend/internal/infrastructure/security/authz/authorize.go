package authz

import (
	"backend/internal/domain"
	"context"
)

func Self(ctx context.Context, resourceUserID uint) error {
	userID, ok := UserID(ctx)
	if !ok {
		return domain.ErrUnauthenticated
	}

	if userID != resourceUserID {
		return domain.ErrForbidden
	}

	return nil
}
