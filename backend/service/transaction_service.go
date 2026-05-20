package service

import (
	"backend/events"
	"backend/handler/authz"
	"backend/repository"
	"backend/repository/model"
	"context"
	"encoding/base64"
	"time"

	"github.com/google/uuid"
	"github.com/ogen-go/ogen/json"
)

type TransactionService struct {
	notifier events.Notifier
	repo     *repository.TransactionRepository
	userRepo *repository.UserRepository
}

func NewTransactionService(repo *repository.TransactionRepository, userRepo *repository.UserRepository) *TransactionService {
	return &TransactionService{repo: repo, userRepo: userRepo}
}

func (s *TransactionService) SetNotifier(notifier events.Notifier) {
	s.notifier = notifier
}

func (s *TransactionService) CreateTransaction(ctx context.Context, senderUsername string, receiverUsername string, amount float64, txType string) (*model.Transaction, error) {
	if senderUsername == receiverUsername {
		return nil, ErrSameUser
	}

	if senderUsername == "" || receiverUsername == "" {
		return nil, ErrNoUsername
	}

	senderId, err := s.userRepo.GetIdByUsername(ctx, senderUsername)
	if err != nil {
		return nil, ErrUserNotFound
	}
	if err := authz.Self(ctx, uint(senderId)); err != nil {
		return nil, authz.ErrForbidden
	}

	receiverId, err := s.userRepo.GetIdByUsername(ctx, receiverUsername)
	if err != nil {
		return nil, ErrUserNotFound
	}

	var status string
	var completedAt *time.Time

	now := time.Now()

	switch txType {
	case "send":

		if account, err := s.userRepo.GetUserBalanceById(uint(senderId)); err != nil {
			return nil, err
		} else if float64(account.Balance) < amount {
			return nil, ErrInsufficientBalance
		}

		status = "completed"
		completedAt = &now
		_, err := s.userRepo.UpdateUserBalanceById(uint(senderId), int64(-amount))
		if err != nil {
			return nil, ErrMoneyNotSend
		}
		_, err = s.userRepo.UpdateUserBalanceById(uint(receiverId), int64(amount))
		if err != nil {
			return nil, ErrMoneyNotSend
		}

	case "request":
		status = "pending"

	default:
		return nil, ErrInvalidTransactionType
	}

	tx := &model.Transaction{
		SenderID:         senderId,
		SenderUsername:   senderUsername,
		ReceiverID:       receiverId,
		ReceiverUsername: receiverUsername,
		Amount:           amount,
		Type:             txType,
		Status:           status,
		CompletedAt:      completedAt,
	}

	if err := s.repo.Create(ctx, tx); err != nil {
		return nil, err
	}
	var usersToRefresh = []uint{uint(senderId), uint(receiverId)}
	s.notifier.NotifyUsersRefresh(usersToRefresh)

	return tx, nil
}

func (s *TransactionService) GetUserTransactionsById(ctx context.Context, userId int64, limit int, cursorStr *string) ([]model.Transaction, *string, bool, error) {
	if userId < 1 {
		return nil, nil, false, ErrNoUserID
	}

	if _, err := s.userRepo.GetUserById(uint(userId)); err != nil {
		return nil, nil, false, ErrUserNotFound
	}

	if limit <= 0 || limit > 100 {
		limit = 50
	}

	var cursor *repository.Cursor
	if cursorStr != nil {
		c, err := DecodeCursor(*cursorStr)
		if err != nil {
			return nil, nil, false, ErrCouldNotDecodeCursor
		}

		cursor = c
	}

	txs, nextCursor, err := s.repo.ListById(ctx, userId, limit, cursor)
	if err != nil {
		return nil, nil, false, err
	}

	if nextCursor == nil {
		return txs, nil, false, nil
	}

	encoded, err := EncodeCursor(nextCursor)
	if err != nil {
		return nil, nil, false, err
	}

	return txs, &encoded, true, nil
}

func (s *TransactionService) AcceptTransaction(ctx context.Context, transactionID string) error {
	return s.unrollTransaction(ctx, transactionID, "completed")
}

func (s *TransactionService) CancelTransaction(ctx context.Context, transactionID string) error {
	return s.unrollTransaction(ctx, transactionID, "cancelled")
}

func (s *TransactionService) RefundTransaction(ctx context.Context, transactionID string) error {
	return s.unrollTransaction(ctx, transactionID, "refund")
}

func (s *TransactionService) RejectTransaction(ctx context.Context, transactionID string) error {
	return s.unrollTransaction(ctx, transactionID, "rejected")
}

func (s *TransactionService) unrollTransaction(ctx context.Context, transactionID, status string) error {
	if err := uuid.Validate(transactionID); err != nil || transactionID == "" {
		return ErrInvalidUUID
	}

	sender, receiver, amount, err := s.repo.GetParticipantsFromTransactionID(ctx, transactionID)
	if err != nil {
		return err
	}

	if status == "completed" {
		if account, err := s.userRepo.GetUserBalanceById(uint(sender)); err != nil {
			return err
		} else if float64(account.Balance) < amount {
			return ErrInsufficientBalance
		}

		_, err = s.userRepo.UpdateUserBalanceById(uint(sender), int64(-amount))
		if err != nil {
			return err
		}
		_, err = s.userRepo.UpdateUserBalanceById(uint(receiver), int64(amount))
		if err != nil {
			return err
		}
	}

	if status == "refund" {
		_, err := s.userRepo.UpdateUserBalanceById(uint(sender), int64(amount))
		if err != nil {
			return err
		}
		_, err = s.userRepo.UpdateUserBalanceById(uint(receiver), int64(-amount))
		if err != nil {
			return err
		}
	}

	if err := s.repo.CompleteTransaction(ctx, transactionID, status); err != nil {
		return ErrTransactionNotCompleted
	}
	var usersToRefresh = []uint{uint(sender), uint(receiver)}
	s.notifier.NotifyUsersRefresh(usersToRefresh)

	return nil
}

func EncodeCursor(c *repository.Cursor) (string, error) {
	b, err := json.Marshal(c)
	if err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(b), nil
}

func DecodeCursor(s string) (*repository.Cursor, error) {
	b, err := base64.StdEncoding.DecodeString(s)
	if err != nil {
		return nil, err
	}

	var c repository.Cursor
	if err = json.Unmarshal(b, &c); err != nil {
		return nil, err
	}

	return &c, nil
}
