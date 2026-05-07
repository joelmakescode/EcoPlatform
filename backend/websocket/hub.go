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
)

type Event struct {
	Type      EventType       `json:"type"`
	UserID    int64           `json:"user_id,omitempty"`
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
	userID int64
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

func (h *Hub) BroadcastToUser(userID int64, event []byte) {
	h.mutex.RLock()
	defer h.mutex.RUnlock()

	for client := range h.clients {
		if client.userID == userID {
			select {
			case client.send <- event:
			default:
				close(client.send)
				delete(h.clients, client)
			}
		}
	}
}

func (h *Hub) BroadcastToUsers(userIDs []int64, event []byte) {
	h.mutex.RLock()
	defer h.mutex.RUnlock()

	for client := range h.clients {
		for _, userID := range userIDs {
			if client.userID == userID {
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

func NewClient(hub *Hub, conn *websocket.Conn, userID int64) *Client {
	return &Client{
		hub:    hub,
		conn:   conn,
		send:   make(chan []byte, 256),
		userID: userID,
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
				log.Printf("WebSocket write error for user %d: %v", c.userID, err)
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
				log.Printf("WebSocket read error for user %d: %v", c.userID, err)
			}
			break
		}
	}
}
