package config

import (
	api "backend/generated"
	"backend/internal/infrastructure/http/middleware"
	"context"
	"errors"
	"fmt"
	"net/http"

	"github.com/ogen-go/ogen/ogenerrors"
)

func SetupServer(dependencies *Dependencies) (*http.Server, error) {
	server, err := api.NewServer(dependencies.APIHandlers, api.WithPathPrefix("/api"), api.WithErrorHandler(createErrorHandler()))
	if err != nil {
		return nil, fmt.Errorf("unable to create server: %w", err)
	}

	mux := http.NewServeMux()
	mux.Handle("/api/", middleware.CORS(middleware.AuthMiddleware(middleware.BotAuthMiddleware(server))))
	mux.HandleFunc("/ws", dependencies.WebSocketHandler.ServeHTTP)

	wrapped := middleware.CORS(mux)
	return &http.Server{
		Addr:    ":8080",
		Handler: wrapped,
	}, nil
}

func createErrorHandler() func(context.Context, http.ResponseWriter, *http.Request, error) {
	return func(_ context.Context, writer http.ResponseWriter, _ *http.Request, err error) {
		code := http.StatusInternalServerError
		var decReqErr *ogenerrors.DecodeRequestError
		var decParamErr *ogenerrors.DecodeParamError

		if errors.As(err, &decReqErr) || errors.As(err, &decParamErr) {
			code = http.StatusBadRequest
		}

		writer.Header().Set("Content-Type", "application/json")
		writer.WriteHeader(code)
	}
}
