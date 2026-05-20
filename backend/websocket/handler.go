package websocket

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Handler struct {
	hub       *Hub
	jwtSecret []byte

	onConnect func(*Client)
}

func NewHandler(hub *Hub, jwtSecret []byte) *Handler {
	return &Handler{
		hub:       hub,
		jwtSecret: jwtSecret,
	}
}

func (h *Handler) Connect(fn func(*Client)) {
	h.onConnect = fn
}

func (h *Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	tokenString := r.URL.Query().Get("token")
	if tokenString == "" {
		tokenString = r.Header.Get("Authorization")
		if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
			tokenString = tokenString[7:]
		}
	}

	if tokenString == "" {
		http.Error(w, "Unauthorized: No token provided", http.StatusUnauthorized)
		return
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return h.jwtSecret, nil
	})

	if err != nil || !token.Valid {
		http.Error(w, "Unauthorized: Invalid token", http.StatusUnauthorized)
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		http.Error(w, "Unauthorized: Invalid token claims", http.StatusUnauthorized)
		return
	}

	userIDFloat, ok := claims["user_id"].(float64)
	if !ok {
		http.Error(w, "Unauthorized: Invalid user ID in token", http.StatusUnauthorized)
		return
	}

	userID := int64(userIDFloat)

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("WebSocket upgrade failed: %v", err)
		return
	}

	client := NewClient(h.hub, conn, uint(userID))
	h.hub.register <- client

	if h.onConnect != nil {
		go h.onConnect(client)
	}

	go client.writePump()
	go client.readPump()
}

func (h *Handler) SendEventToUser(eventType EventType, userID uint, data interface{}, priority string) error {
	event := Event{
		Type:      eventType,
		UserID:    userID,
		Timestamp: time.Now().Format(time.RFC3339),
		Priority:  priority,
	}

	if data != nil {
		jsonData, err := json.Marshal(data)
		if err != nil {
			return err
		}
		event.Data = jsonData
	}

	eventJSON, err := json.Marshal(event)
	if err != nil {
		return err
	}

	h.hub.BroadcastToUser(uint(userID), eventJSON)
	return nil
}

func (h *Handler) SendEventToUsers(eventType EventType, userIDs []uint, data interface{}, priority string) error {
	event := Event{
		Type:      eventType,
		Timestamp: time.Now().Format(time.RFC3339),
		Priority:  priority,
	}

	if data != nil {
		jsonData, err := json.Marshal(data)
		if err != nil {
			return err
		}
		event.Data = jsonData
	}

	eventJSON, err := json.Marshal(event)
	if err != nil {
		return err
	}

	h.hub.BroadcastToUsers(userIDs, eventJSON)
	return nil
}

func (h *Handler) SendEventToAll(eventType EventType, data interface{}, priority string) error {
	event := Event{
		Type:      eventType,
		Timestamp: time.Now().Format(time.RFC3339),
		Priority:  priority,
	}

	if data != nil {
		jsonData, err := json.Marshal(data)
		if err != nil {
			return err
		}
		event.Data = jsonData
	}

	eventJSON, err := json.Marshal(event)
	if err != nil {
		return err
	}

	h.hub.BroadcastToAll(eventJSON)
	return nil
}

func (h *Handler) NotifyUserRefresh(userId uint) error {
	return h.NotifyUserToRefresh(userId)
}

func (h *Handler) NotifyUserToRefresh(userID uint) error {
	event := Event{
		Type:      "refresh",
		UserID:    userID,
		Timestamp: time.Now().Format(time.RFC3339),
		Priority:  "normal",
	}

	eventJSON, err := json.Marshal(event)
	if err != nil {
		return err
	}

	h.hub.BroadcastToUser(userID, eventJSON)
	return nil
}

func (h *Handler) NotifyUsersToRefresh(userIDs []uint) error {
	event := Event{
		Type:      "refresh",
		Timestamp: time.Now().Format(time.RFC3339),
		Priority:  "normal",
	}

	eventJSON, err := json.Marshal(event)
	if err != nil {
		return err
	}

	h.hub.BroadcastToUsers(userIDs, eventJSON)
	return nil
}

func (h *Handler) NotifyUsersRefresh(userIds []uint) error {
	return h.NotifyUsersToRefresh(userIds)
}
