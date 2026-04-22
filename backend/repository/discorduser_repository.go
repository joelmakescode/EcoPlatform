package repository

import (
	"backend/api"
	"backend/repository/model"
	"time"

	"gorm.io/gorm"
)

type DiscordUserRepository struct {
	db *gorm.DB
}

func NewDiscordUserRepository(db *gorm.DB) *DiscordUserRepository {
	return &DiscordUserRepository{db: db}
}

func (r *DiscordUserRepository) SaveDiscordUser(discordUser *model.DiscordUser) (*model.DiscordUser, error) {
	if err := r.db.Create(&discordUser).Error; err != nil {
		return nil, err
	}

	return discordUser, nil
}

func (r *DiscordUserRepository) GetDiscordUserSessionData(user *api.DiscordUserLoginData) (*model.DiscordUser, error) {
	var discordUser model.DiscordUser
	if err := r.db.Where("discord_id = ?", user.DiscordId).First(&discordUser).Error; err != nil {
		return nil, err
	}

	return &discordUser, nil
}

func (r *DiscordUserRepository) GetAutofillById(userId string) (*int, error) {
	var discordUser model.DiscordUser
	if err := r.db.Where("discord_id = ?", userId).First(&discordUser).Error; err != nil {
		return nil, err
	}

	return discordUser.Autofill, nil
}

func (r *DiscordUserRepository) UpdateAutofillById(userId string) (*int, error) {
	var discordUser model.DiscordUser
	currentAutofill, err := r.GetAutofillById(userId)
	if err != nil {
		return nil, err
	}

	newValue := 0
	if *currentAutofill == 0 {
		newValue = 1
	}

	if err = r.db.Model(&discordUser).Where("discord_id = ?", userId).Update("autofill", newValue).Error; err != nil {
		return nil, err
	}

	return &newValue, nil
}

func (r *DiscordUserRepository) GetLanguageById(userId string) (*string, error) {
	var discordUser model.DiscordUser
	if err := r.db.Where("discord_id = ?", userId).First(&discordUser).Error; err != nil {
		return nil, err
	}

	return discordUser.Language, nil
}

func (r *DiscordUserRepository) UpdateLanguageById(userId, language string) (*string, error) {
	var discordUser model.DiscordUser
	if err := r.db.Model(&discordUser).Where("discord_id = ?", userId).Update("language", language).Error; err != nil {
		return nil, err
	}

	return discordUser.Language, nil
}

func (r *DiscordUserRepository) GetAccountLinkById(userId string) (*model.Account, error) {
	var link model.AccountDiscordLink

	if err := r.db.Joins("DiscordUser").Preload("Account").Where("discord_users.discord_id = ?", userId).First(&link).Error; err != nil {
		return nil, err
	}

	return &link.Account, nil
}

func (r *DiscordUserRepository) LinkAccount(link *model.AccountDiscordLink) (*model.AccountDiscordLink, error) {
	if err := r.db.Create(&link).Error; err != nil {
		return nil, err
	}

	return link, nil
}

func (r *DiscordUserRepository) GetAccountIdByCode(code string) (*model.LinkAccountCode, error) {
	var link model.LinkAccountCode
	if err := r.db.Where("code = ?", code).First(&link).Error; err != nil {
		return nil, err
	}

	return &link, nil
}

func (r *DiscordUserRepository) GetExpirationDate(code string) (*time.Time, error) {
	var link model.LinkAccountCode
	if err := r.db.Where("code = ?", code).First(&link).Error; err != nil {
		return nil, err
	}

	return &link.ExpiresAt, nil
}

func (r *DiscordUserRepository) GetUsedData(code string) (*time.Time, error) {
	var link model.LinkAccountCode
	if err := r.db.Where("code = ?", code).First(&link).Error; err != nil {
		return nil, err
	}

	return link.UsedAt, nil
}

func (r *DiscordUserRepository) SetCodeToUsed(code string) error {
	var link model.LinkAccountCode
	if err := r.db.Model(&link).Where("code = ?", code).Update("used_at", time.Now()).Error; err != nil {
		return err
	}

	return nil
}
