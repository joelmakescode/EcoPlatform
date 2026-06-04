# -------- build stage --------
FROM golang:1.25-alpine AS builder

WORKDIR /build
ENV GOTOOLCHAIN=local

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -o server ./cmd/api

# -------- runtime stage --------
FROM gcr.io/distroless/base-debian12

WORKDIR /app
COPY --from=builder /build/server /app/server

EXPOSE 3000
USER nonroot:nonroot
ENTRYPOINT ["/app/server"]