package service

import (
	"backend/api"
	"backend/internal/infrastructure/persistence/models"
	"backend/internal/infrastructure/persistence/repositories"
	"errors"
	"strings"
	"time"
	"unicode/utf8"

	"gorm.io/gorm"
)

type DiscordUserService struct {
	repo *repositories.DiscordUserRepository
}

func NewDiscordUserService(repo *repositories.DiscordUserRepository) *DiscordUserService {
	return &DiscordUserService{repo: repo}
}

func (s *DiscordUserService) CreateUser(newDiscordUser *api.CreateDiscordUserData) (*api.DiscordUser, error) {
	if newDiscordUser.DiscordId == "" {
		return nil, ErrNoDiscordUserID
	}

	user := s.MapUserToModel(newDiscordUser)
	if pw := newDiscordUser.Password; pw != "" && utf8.RuneCountInString(pw) >= 8 {
		hashedPassword, err := HashPassword(pw)
		if err != nil {
			return nil, ErrPasswordNotHashed
		}

		user.PasswordHash = string(hashedPassword)
	} else {
		return nil, ErrInvalidPassword
	}

	createdUser, err := s.repo.SaveDiscordUser(user)
	if err != nil {
		if isUniqueConstraintError(err) {
			return nil, ErrUniqueConstraint
		}

		return nil, err
	}

	return s.MapModelToApiDiscordUser(createdUser), nil
}

func (s *DiscordUserService) LoginUser(discordUser *api.DiscordUserLoginData) (*api.DiscordUserSessionData, error) {
	if discordUser.DiscordId == "" || discordUser.Password == "" {
		return nil, ErrInvalidDiscordIdOrPassword
	}

	user, err := s.repo.GetDiscordUserSessionData(discordUser)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}

		return nil, err
	}

	valid := ValidatePasswordToHash([]byte(discordUser.Password), []byte(user.PasswordHash))
	if !valid {
		return nil, ErrInvalidPassword
	}

	return s.MapModelToDiscordUserSessionData(user), nil
}

func (s *DiscordUserService) GetAutofillById(userId string) (*api.DiscordUserAutofill, error) {
	if userId == "" {
		return nil, ErrNoDiscordUserID
	}

	autofill, err := s.repo.GetAutofillById(userId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}

		return nil, err
	}

	return &api.DiscordUserAutofill{Autofill: *autofill}, err
}

func (s *DiscordUserService) UpdateAutofillById(userId string) (*api.DiscordUserAutofill, error) {
	if userId == "" {
		return nil, ErrNoDiscordUserID
	}

	autofill, err := s.repo.UpdateAutofillById(userId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}

		return nil, err
	}

	return &api.DiscordUserAutofill{Autofill: *autofill}, nil
}

func (s *DiscordUserService) GetLanguageById(userId string) (*api.DiscordUserLanguage, error) {
	if userId == "" {
		return nil, ErrNoDiscordUserID
	}

	language, err := s.repo.GetLanguageById(userId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}

		return nil, err
	}

	return &api.DiscordUserLanguage{Language: *language}, nil
}

func (s *DiscordUserService) UpdateLanguageById(userId string, language string) (*api.DiscordUserLanguage, error) {
	if userId == "" {
		return nil, ErrNoDiscordUserID
	}

	if !strings.EqualFold(language, "en") && !strings.EqualFold(language, "de") {
		return nil, ErrInvalidLanguage
	}

	newLanguage, err := s.repo.UpdateLanguageById(userId, language)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}

		return nil, err
	}

	return &api.DiscordUserLanguage{Language: *newLanguage}, nil
}

func (s *DiscordUserService) GetAccountLinkById(userId string) (*api.LinkedAccountID, error) {
	if userId == "" {
		return nil, ErrNoDiscordUserID
	}

	link, err := s.repo.GetAccountLinkById(userId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}

		return nil, err
	}

	return &api.LinkedAccountID{ID: int(link.ID)}, nil
}

func (s *DiscordUserService) LinkAccount(userId, code string) (*api.LinkedAccountID, error) {
	if userId == "" {
		return nil, ErrNoDiscordUserID
	}

	if code == "" || utf8.RuneCountInString(code) != 6 {
		return nil, ErrInvalidCode
	}

	expired, err := s.IsCodeExpired(code)
	if err != nil {
		return nil, err
	}

	if expired {
		return nil, ErrCodeExpired
	}

	used, err := s.IsCodeUsed(code)
	if err != nil {
		return nil, err
	}

	if used {
		return nil, ErrCodeUsed
	}

	account, err := s.repo.GetAccountIdByCode(code)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrNoEntryFoundForCode
		}
	}

	accountLink := &models.AccountDiscordLink{
		AccountID:     account.AccountID,
		DiscordUserID: userId,
		LinkedAt:      time.Now(),
	}

	link, err := s.repo.LinkAccount(accountLink)
	if err != nil {
		if errors.Is(err, gorm.ErrInvalidTransaction) {
			return nil, ErrFailedDBTransaction
		}
		if isUniqueConstraintError(err) {
			return nil, ErrUniqueConstraint
		}
		return nil, err
	}

	if err = s.repo.SetCodeToUsed(code); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrNoEntryFoundForCode
		}
		if errors.Is(err, gorm.ErrInvalidTransaction) {
			return nil, ErrFailedDBTransaction
		}
		return nil, err
	}

	return &api.LinkedAccountID{ID: int(link.AccountID)}, nil
}

func (s *DiscordUserService) MapUserToModel(user *api.CreateDiscordUserData) *models.DiscordUser {
	return &models.DiscordUser{
		DiscordId:    user.DiscordId,
		PasswordHash: user.Password,
	}
}

func (s *DiscordUserService) MapModelToApiDiscordUser(user *models.DiscordUser) *api.DiscordUser {
	return &api.DiscordUser{
		ID:        int(user.ID),
		DiscordId: user.DiscordId,
	}
}

func (s *DiscordUserService) MapModelToDiscordUserSessionData(user *models.DiscordUser) *api.DiscordUserSessionData {
	return &api.DiscordUserSessionData{
		DiscordId: user.DiscordId,
		Autofill:  *user.Autofill,
		Language:  *user.Language,
	}
}

func (s *DiscordUserService) IsCodeExpired(code string) (bool, error) {
	expiration, err := s.repo.GetExpirationDate(code)
	if err != nil {
		return true, err
	}

	if expiration.Add(15 * time.Minute).Before(time.Now()) {
		return true, err
	}

	return false, nil
}

func (s *DiscordUserService) IsCodeUsed(code string) (bool, error) {
	used, err := s.repo.GetUsedData(code)
	if err != nil {
		return true, err
	}

	if used != nil {
		return true, nil
	}

	return false, nil
}
