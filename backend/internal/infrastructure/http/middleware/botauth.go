package middleware

import (
	"backend/handler/ctxkeys"
	"context"
	"net/http"
	"os"
	"strings"
)

func BotAuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !strings.HasPrefix(r.URL.Path, "/api/discord-users") {
			next.ServeHTTP(w, r)
			return
		}

		header := r.Header.Get("Authorization")
		if header == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		parts := strings.SplitN(header, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		if parts[1] != os.Getenv("BOT_API_TOKEN") {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(
			r.Context(),
			ctxkeys.DiscordBotKey,
			"discord-bot",
		)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
