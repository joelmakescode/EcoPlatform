package repository

import (
	"backend/internal/infrastructure/persistence/models"
	"context"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Cursor struct {
	CreatedAt time.Time
	ID        uuid.UUID
}

type TransactionRepository struct {
	db *gorm.DB
}

func NewTransactionRepository(db *gorm.DB) *TransactionRepository {
	return &TransactionRepository{db: db}
}

func (r *TransactionRepository) Create(ctx context.Context, tx *models.Transaction) error {
	return r.db.WithContext(ctx).Create(tx).Error
}

func (r *TransactionRepository) ListById(ctx context.Context, userId int64, limit int, cursor *Cursor) ([]models.Transaction, *Cursor, error) {
	query := r.db.WithContext(ctx).Where("(sender_id = ? OR receiver_id = ?)", userId, userId).Order("created_at DESC, id DESC").Limit(limit + 1)

	if cursor != nil {
		query = query.Where("(created_at < ?) OR (created_at = ? AND id < ?)", cursor.CreatedAt, cursor.CreatedAt, cursor.ID)
	}

	var txs []models.Transaction
	if err := query.Find(&txs).Error; err != nil {
		return nil, nil, err
	}

	var nextCursor *Cursor
	if len(txs) > limit {
		last := txs[limit]
		nextCursor = &Cursor{
			CreatedAt: last.CreatedAt,
			ID:        uuid.UUID(last.ID),
		}

		txs = txs[:limit]
	}

	return txs, nextCursor, nil
}

func (r *TransactionRepository) GetParticipantsFromTransactionID(ctx context.Context, transactionID string) (int64, int64, float64, error) {
	uid, err := parseUUID(transactionID)
	if err != nil {
		return 0, 0, 0, err
	}

	var result struct {
		SenderID   int64   `gorm:"column:sender_id"`
		ReceiverID int64   `gorm:"column:receiver_id"`
		Amount     float64 `gorm:"column:amount"`
	}

	err = r.db.Model(&models.Transaction{}).Select("sender_id, receiver_id, amount").Where("id = ?", uid[:]).Scan(&result).Error
	if err != nil {
		return 0, 0, 0, err
	}

	return result.SenderID, result.ReceiverID, result.Amount, nil
}

func (r *TransactionRepository) CompleteTransaction(ctx context.Context, transactionID string, status string) error {
	uid, err := parseUUID(transactionID)
	if err != nil {
		return err
	}

	return r.db.WithContext(ctx).Model(&models.Transaction{}).Where("id = ?", uid[:]).Updates(map[string]interface{}{"status": status, "completed_at": time.Now()}).Error
}

func parseUUID(transactionID string) (uuid.UUID, error) {
	uid, err := uuid.Parse(transactionID)
	if err != nil {
		return uuid.Nil, err
	}

	return uid, nil
}
