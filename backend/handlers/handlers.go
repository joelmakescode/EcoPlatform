package handlers

import (
    "context"
    api "EcoPlatform/backend/api/gen"
)

type Handler struct{}

func New() *Handler {
    return &Handler{}
}

func (h *Handler) Ping(ctx context.Context) (*api.PingOK, error) {
    return &api.PingOK{
        Message: "Pong",
    }, nil
}