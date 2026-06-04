package repository

import (
	"backend/internal/infrastructure/persistence/models"
	"context"
	"time"

	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) ClaimDaily(userId uint) error {
	var account models.Account
	err := r.db.First(&account, "id = ?", userId).Update("daily_claim", time.Now()).Error
	if err != nil {
		return err
	}

	return nil
}

func (r *UserRepository) GetIdByUsername(ctx context.Context, username string) (int64, error) {
	var user models.User
	err := r.db.WithContext(ctx).Where("username = ?", username).First(&user).Error
	if err != nil {
		return 0, err
	}

	return int64(user.ID), nil
}

func (r *UserRepository) GetUserAccount(userId uint) (*models.Account, error) {
	var account models.Account
	err := r.db.Where("id = ?", userId).First(&account).Error
	if err != nil {
		return nil, err
	}

	return &account, nil
}

func (r *UserRepository) GetUserByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.db.Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, err
}

func (r *UserRepository) GetUserById(userId uint) (*models.User, error) {
	var user models.User
	err := r.db.Where("id = ?", userId).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) GetUsernameById(userId int64) (string, error) {
	var username string
	err := r.db.Model(&models.User{}).Select("username").Where("id = ?", userId).Scan(&username).Error
	if err != nil {
		return "", err
	}

	return username, nil
}

func (r *UserRepository) GetUserBalanceById(userId uint) (*models.Account, error) {
	var user models.User
	err := r.db.Preload("Account").First(&user, userId).Error
	if err != nil {
		return nil, err
	}
	return &user.Account, nil
}

func (r *UserRepository) UpdateUserBalanceById(userId uint, delta int64) (*models.Account, error) {
	var user models.User
	if err := r.db.Preload("Account").First(&user, userId).Error; err != nil {
		return nil, err
	}

	if err := r.db.Model(&user.Account).Update("balance", gorm.Expr("balance + ?", delta)).Error; err != nil {
		return nil, err
	}

	return &user.Account, nil
}

func (r *UserRepository) SaveUser(user *models.User) (*models.User, error) {
	err := r.db.Transaction(func(tx *gorm.DB) error {
		account := models.Account{
			DailyClaim: time.Now(),
			Balance:    1000,
		}
		if err := tx.Create(&account).Error; err != nil {
			return err
		}

		casinoAccount := models.CasinoAccount{
			AccountID: account.ID,
			Balance:   0,
		}

		if err := tx.Create(&casinoAccount).Error; err != nil {
			return err
		}

		user.AccountID = int64(account.ID)
		if err := tx.Create(user).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return user, nil
}

func (r *UserRepository) CreateLinkAccountCode(linkModel *models.LinkAccountCode) (*models.LinkAccountCode, error) {
	if err := r.db.Create(&linkModel).Error; err != nil {
		return nil, err
	}

	return linkModel, nil
}
