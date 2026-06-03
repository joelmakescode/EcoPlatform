package authz

import (
	"context"
)

func UserID(ctx context.Context) (uint, bool) {
	id, ok := ctx.Value(UserIDKey).(uint)
	return id, ok
}
