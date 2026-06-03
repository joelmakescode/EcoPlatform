package games

import (
	"backend/internal/domain"
	"backend/internal/infrastructure/persistence/repository"
	"backend/internal/infrastructure/websocket"
	"math/rand"
	"strconv"
	"strings"
	"time"
)

type RollADiceHandler struct {
	repo         *repository.CasinoRepository
	eventEmitter EventEmitter

	currentRoundId int64
	state          GameState
}

func NewRollADiceHandler(repo *repository.CasinoRepository, eventEmitter EventEmitter) *RollADiceHandler {
	return &RollADiceHandler{repo: repo, eventEmitter: eventEmitter}
}

type EventEmitter interface {
	SendEventToAll(eventType websocket.EventType, data interface{}, priority string) error
	SendEventToUser(eventType websocket.EventType, userId uint, data interface{}, priority string) error
}

type GameState struct {
	TimeLeft int
	IsLocked bool
	Dice1    int
	Dice2    int
}

var currentGameState = GameState{
	TimeLeft: 15,
	IsLocked: false,
	Dice1:    1,
	Dice2:    1,
}

func (h *RollADiceHandler) GetCurrentRoundId() int64 {
	return h.currentRoundId
}

func (h *RollADiceHandler) Start() {
	for {
		round, _ := h.repo.CreateRollADiceRound()
		h.currentRoundId = round.ID

		currentGameState.IsLocked = false
		currentGameState.TimeLeft = 15

		h.eventEmitter.SendEventToAll(websocket.EventTypeRoundStart, map[string]interface{}{
			"timeLeft": 15,
		}, "normal")

		for i := 15; i > 0; i-- {
			currentGameState.TimeLeft = i

			h.eventEmitter.SendEventToAll(websocket.EventTypeRoundTimer, map[string]interface{}{
				"timeLeft": i,
				"dice1":    currentGameState.Dice1,
				"dice2":    currentGameState.Dice2,
			}, "normal")
			time.Sleep(1 * time.Second)
		}

		currentGameState.IsLocked = true
		h.eventEmitter.SendEventToAll(websocket.EventTypeRoundLock, nil, "normal")

		dice1 := rand.Intn(6) + 1
		dice2 := rand.Intn(6) + 1

		currentGameState.Dice1 = dice1
		currentGameState.Dice2 = dice2

		if err := h.repo.UpdateRollADiceRound(h.GetCurrentRoundId(), dice1, dice2); err != nil {
			return
		}

		bets, err := h.repo.GetBetsByRound(h.GetCurrentRoundId())
		if err != nil {
			return
		}

		userWins := make(map[uint]int64)

		for _, bet := range bets {
			if isBetWon(bet.BetKey, dice1, dice2) {
				multiplier := domain.BetsMultipliers[bet.BetKey]
				win := bet.Amount * multiplier
				userWins[bet.UserID] += win
			}
		}

		h.eventEmitter.SendEventToAll(websocket.EventTypeRoundResult, map[string]interface{}{
			"dice1": dice1,
			"dice2": dice2,
		}, "normal")

		for userId, win := range userWins {
			_ = h.repo.UpdateCasinoAccountBalance(userId, win)

			account, _ := h.repo.GetCasinoAccountById(userId)
			h.eventEmitter.SendEventToUser(websocket.EventTypeCasinoBalanceUpdated, userId, map[string]interface{}{
				"balance": account.Balance,
			}, "normal")

			h.eventEmitter.SendEventToUser(websocket.EventTypeCasinoWin, userId, map[string]interface{}{
				"win_amount": win,
			}, "normal")
		}

		time.Sleep(5 * time.Second)
	}
}

func (h *RollADiceHandler) SendCurrentGameState(client *websocket.Client) {
	h.eventEmitter.SendEventToUser(websocket.EventTypeGameState, client.UserID, map[string]interface{}{
		"timeLeft": currentGameState.TimeLeft,
		"isLocked": currentGameState.IsLocked,
		"dice1":    currentGameState.Dice1,
		"dice2":    currentGameState.Dice2,
	}, "normal")
}

func (h *RollADiceHandler) SendCurrentBalance(userId uint, balance int64) {
	h.eventEmitter.SendEventToUser(websocket.EventTypeCasinoBalanceUpdated, userId, map[string]interface{}{
		"balance": balance,
	}, "normal")
}

func isBetWon(key string, d1, d2 int) bool {
	sum := d1 + d2

	switch {
	case strings.HasPrefix(key, "single-"):
		val, _ := strconv.Atoi(strings.TrimPrefix(key, "single-"))
		return d1 == val || d2 == val

	case strings.HasPrefix(key, "both-"):
		val, _ := strconv.Atoi(strings.TrimPrefix(key, "both-"))
		return sum == val

	case strings.HasPrefix(key, "double-"):
		val, _ := strconv.Atoi(strings.TrimPrefix(key, "double-"))
		return d1 == val && d2 == val

	case key == "random-double":
		return d1 == d2
	}

	return false
}
