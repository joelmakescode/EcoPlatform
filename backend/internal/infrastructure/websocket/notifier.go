package websocket

import (
	"backend/internal/application/ports"
	"encoding/json"
)

var _ ports.Notifier = (*Hub)(nil)

func (h *Hub) NotifyUserRefresh(userId uint) error {
	event := map[string]interface{}{
		"type": "refresh",
	}

	data, err := json.Marshal(event)
	if err != nil {
		return err
	}

	h.BroadcastToUser(userId, data)
	return nil
}

func (h *Hub) NotifyUsersRefresh(userIds []uint) error {
	event := map[string]interface{}{
		"type": "refresh",
	}

	data, err := json.Marshal(event)
	if err != nil {
		return err
	}

	h.BroadcastToUsers(userIds, data)
	return nil
}
