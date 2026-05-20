package websocket

import (
	"encoding/json"
	"log"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

type EventType string

const (
	// Transaktions-Events
	EventTypeTransactionCreated EventType = "transaction_created"
	EventTypeTransactionUpdated EventType = "transaction_updated"

	// Nutzer-Events
	EventTypeUserBalanceUpdated EventType = "user_balance_updated"
	EventTypeUserStatusChanged  EventType = "user_status_changed"

	// Benachrichtigungs-Events
	EventTypeNotification EventType = "notification"

	// Casino-Events
	EventTypeRoundStart  EventType = "round_start"
	EventTypeRoundTimer  EventType = "round_timer"
	EventTypeRoundLock   EventType = "round_lock"
	EventTypeRoundResult EventType = "round_result"
	EventTypeGameState   EventType = "game_state"

	EventTypeCasinoBalanceUpdated EventType = "casino_balance_updated"
	EventTypeCasinoWin            EventType = "casino_win"
)

type Event struct {
	Type      EventType       `json:"type"`
	UserID    uint            `json:"user_id,omitempty"`
	Data      json.RawMessage `json:"data,omitempty"`
	Timestamp string          `json:"timestamp"`
	Priority  string          `json:"priority,omitempty"`
}

type Hub struct {
	clients    map[*Client]bool
	broadcast  chan []byte
	register   chan *Client
	unregister chan *Client
	mutex      sync.RWMutex
}

type Client struct {
	hub    *Hub
	conn   *websocket.Conn
	send   chan []byte
	UserID uint
}

func NewHub() *Hub {
	return &Hub{
		clients:    make(map[*Client]bool),
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.mutex.Lock()
			h.clients[client] = true
			h.mutex.Unlock()

		case client := <-h.unregister:
			h.mutex.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
			h.mutex.Unlock()

		case message := <-h.broadcast:
			h.mutex.RLock()
			for client := range h.clients {
				select {
				case client.send <- message:
				default:
					close(client.send)
					delete(h.clients, client)
				}
			}
			h.mutex.RUnlock()
		}
	}
}

func (h *Hub) BroadcastToUser(userID uint, event []byte) {
	h.mutex.RLock()
	defer h.mutex.RUnlock()

	for client := range h.clients {
		if client.UserID == userID {
			select {
			case client.send <- event:
			default:
				close(client.send)
				delete(h.clients, client)
			}
		}
	}
}

func (h *Hub) BroadcastToUsers(userIDs []uint, event []byte) {
	h.mutex.RLock()
	defer h.mutex.RUnlock()

	for client := range h.clients {
		for _, userID := range userIDs {
			if client.UserID == userID {
				select {
				case client.send <- event:
				default:
					close(client.send)
					delete(h.clients, client)
				}
				break
			}
		}
	}
}

func (h *Hub) BroadcastToAll(event []byte) {
	h.mutex.RLock()
	defer h.mutex.RUnlock()

	for client := range h.clients {
		select {
		case client.send <- event:
		default:
			close(client.send)
			delete(h.clients, client)
		}
	}
}

func NewClient(hub *Hub, conn *websocket.Conn, userID uint) *Client {
	return &Client{
		hub:    hub,
		conn:   conn,
		send:   make(chan []byte, 256),
		UserID: userID,
	}
}

func (c *Client) writePump() {
	defer func() {
		c.conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			if err := c.conn.WriteMessage(websocket.TextMessage, message); err != nil {
				log.Printf("WebSocket write error for user %d: %v", c.UserID, err)
				return
			}
		}
	}
}

func (c *Client) readPump() {
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()
	}()

	c.conn.SetReadLimit(512)
	c.conn.SetReadDeadline(time.Now().Add(60 * time.Second))
	c.conn.SetPongHandler(func(string) error {
		c.conn.SetReadDeadline(time.Now().Add(60 * time.Second))
		return nil
	})

	for {
		_, _, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("WebSocket read error for user %d: %v", c.UserID, err)
			}
			break
		}
	}
}
