package middleware

import (
	"backend/internal/infrastructure/security/authz"
	"context"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var publicPaths = map[string]bool{
	"/api/login": true,
	"/api/users": true,
}

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if publicPaths[r.URL.Path] || strings.HasPrefix(r.URL.Path, "/api/discord-users") {
			next.ServeHTTP(w, r)
			return
		}

		header := r.Header.Get("Authorization")
		if header == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		parts := strings.SplitN(header, " ", 2)
		if len(parts) != 2 {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		claims, err := ParseJWTToken(parts[1])
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), authz.UserIDKey, claims.UserID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

var secret = []byte("ecoplatform")

type Claims struct {
	UserID uint `json:"user_id"`
	jwt.RegisteredClaims
}

func GenerateJWTToken(userId uint) (string, error) {
	claims := Claims{
		UserID: userId,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(30 * time.Minute)),
		},
	}

	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return t.SignedString(secret)
}

func ParseJWTToken(token string) (*Claims, error) {
	t, err := jwt.ParseWithClaims(
		token,
		&Claims{},
		func(_ *jwt.Token) (interface{}, error) {
			return secret, nil
		},
	)

	if err != nil || !t.Valid {
		return nil, err
	}

	return t.Claims.(*Claims), nil
}
