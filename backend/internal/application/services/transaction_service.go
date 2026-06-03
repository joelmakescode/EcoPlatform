package service

import (
	"backend/internal/application/dto"
	"backend/internal/application/ports"
	"backend/internal/domain"
	"context"
	"encoding/base64"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/ogen-go/ogen/json"
	"gorm.io/gorm"
)

type TransactionService struct {
	notifier              ports.Notifier
	transactionRepository ports.TransactionRepository
	userRepository        ports.UserRepository
}

func NewTransactionService(notifier ports.Notifier, transactionRepository ports.TransactionRepository, userRepository ports.UserRepository) *TransactionService {
	return &TransactionService{notifier: notifier, transactionRepository: transactionRepository, userRepository: userRepository}
}

func (s *TransactionService) CreateTransaction(ctx context.Context, input *dto.CreateTransactionInput) (*dto.TransactionOutput, error) {
	if input.SenderUsername == input.ReceiverUsername {
		return nil, domain.ErrSameUser
	}

	if input.SenderUsername == "" || input.ReceiverUsername == "" {
		return nil, domain.ErrNoUsername
	}

	senderId, err := s.userRepository.GetIdByUsername(ctx, input.SenderUsername)
	if err != nil {
		return nil, domain.ErrUserNotFound
	}

	receiverId, err := s.userRepository.GetIdByUsername(ctx, input.ReceiverUsername)
	if err != nil {
		return nil, domain.ErrUserNotFound
	}

	var status domain.TransactionStatus
	var completedAt *time.Time

	now := time.Now()

	switch input.Type {
	case "send":
		if account, err := s.userRepository.GetUserBalance(ctx, senderId); err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, domain.ErrUserNotFound
			}

			return nil, err
		} else if account.Balance < input.Amount {
			return nil, domain.ErrInsufficientBalance
		}

		status = domain.TransactionStatusComplete
		completedAt = &now

		_, err := s.userRepository.UpdateUserBalance(ctx, senderId, -input.Amount)
		if err != nil {
			return nil, domain.ErrMoneyNotSend
		}
		_, err = s.userRepository.UpdateUserBalance(ctx, receiverId, input.Amount)
		if err != nil {
			return nil, domain.ErrMoneyNotSend
		}

	case "request":
		status = domain.TransactionStatusPending

	default:
		return nil, domain.ErrInvalidTransactionType
	}

	tx := &domain.Transaction{
		SenderID:         senderId,
		SenderUsername:   input.SenderUsername,
		ReceiverID:       receiverId,
		ReceiverUsername: input.ReceiverUsername,
		Amount:           input.Amount,
		Type:             input.Type,
		Status:           status,
		CompletedAt:      completedAt,
	}

	if err := s.transactionRepository.Create(ctx, tx); err != nil {
		return nil, err
	}
	var usersToRefresh = []uint{senderId, receiverId}
	err = s.notifier.NotifyUsersRefresh(usersToRefresh)
	if err != nil {
		//TODO Correct error implementation
		return nil, err
	}

	return &dto.TransactionOutput{
		SenderID:         senderId,
		SenderUsername:   input.SenderUsername,
		ReceiverID:       receiverId,
		ReceiverUsername: input.ReceiverUsername,
		Amount:           input.Amount,
		Type:             input.Type,
		Status:           status,
		CompletedAt:      completedAt,
	}, nil
}

func (s *TransactionService) GetUserTransactions(ctx context.Context, input *dto.GetTransactionsInput) ([]*dto.TransactionOutput, *string, bool, error) {
	if _, err := s.userRepository.GetUser(ctx, input.UserID); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil, false, domain.ErrUserNotFound
		}

		return nil, nil, false, err
	}

	if input.Limit <= 0 || input.Limit > 100 {
		input.Limit = 50
	}

	var cursor *domain.Cursor
	if input.Cursor != nil {
		c, err := DecodeCursor(*input.Cursor)
		if err != nil {
			return nil, nil, false, err
		}

		cursor = c
	}

	txs, nextCursor, err := s.transactionRepository.List(ctx, input.UserID, input.Limit, cursor)
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

func (s *TransactionService) unrollTransaction(ctx context.Context, transactionID string, status domain.TransactionStatus) error {
	if err := uuid.Validate(transactionID); err != nil || transactionID == "" {
		return domain.ErrInvalidUUID
	}

	senderId, receiverId, amount, err := s.transactionRepository.GetParticipantsFromTransaction(ctx, transactionID)
	if err != nil {
		return err
	}

	if status == domain.TransactionStatusComplete {
		if account, err := s.userRepository.GetUserBalance(ctx, senderId); err != nil {
			return err
		} else if account.Balance < amount {
			return domain.ErrInsufficientBalance
		}

		_, err = s.userRepository.UpdateUserBalance(ctx, senderId, -amount)
		if err != nil {
			return err
		}
		_, err = s.userRepository.UpdateUserBalance(ctx, receiverId, amount)
		if err != nil {
			return err
		}
	}

	if status == domain.TransactionStatusRefunded {
		_, err := s.userRepository.UpdateUserBalance(ctx, senderId, amount)
		if err != nil {
			return err
		}
		_, err = s.userRepository.UpdateUserBalance(ctx, receiverId, -amount)
		if err != nil {
			return err
		}
	}

	if err := s.transactionRepository.CompleteTransaction(ctx, transactionID, status); err != nil {
		return err
	}
	var usersToRefresh = []uint{senderId, receiverId}
	s.notifier.NotifyUsersRefresh(usersToRefresh)

	return nil
}

func EncodeCursor(c *domain.Cursor) (string, error) {
	b, err := json.Marshal(c)
	if err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(b), nil
}

func DecodeCursor(s string) (*domain.Cursor, error) {
	b, err := base64.StdEncoding.DecodeString(s)
	if err != nil {
		return nil, err
	}

	var c domain.Cursor
	if err = json.Unmarshal(b, &c); err != nil {
		return nil, err
	}

	return &c, nil
}
