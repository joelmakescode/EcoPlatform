package authz

import (
	"backend/handler/ctxkeys"
	"context"
)

func UserID(ctx context.Context) (uint, bool) {
	id, ok := ctx.Value(ctxkeys.UserIDKey).(uint)
	return id, ok
}
