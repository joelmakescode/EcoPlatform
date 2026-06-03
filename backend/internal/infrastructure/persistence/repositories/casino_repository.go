package repositories

import (
	"backend/internal/infrastructure/persistence/models"

	"gorm.io/gorm"
)

type CasinoRepository struct {
	db *gorm.DB
}

func NewCasinoRepository(db *gorm.DB) *CasinoRepository {
	return &CasinoRepository{db: db}
}

func (r *CasinoRepository) CreateRollADiceRound() (*models.DiceRound, error) {
	var round models.DiceRound
	err := r.db.Create(&round).Error
	if err != nil {
		return nil, err
	}

	return &round, nil
}

func (r *CasinoRepository) CreateBet(userId uint, roundId int64, bets map[string]int64) error {
	var betsToInsert []models.DiceBet
	for key, amount := range bets {
		betsToInsert = append(betsToInsert, models.DiceBet{
			UserID:  userId,
			Amount:  amount,
			BetKey:  key,
			RoundID: roundId,
		})
	}

	return r.db.Create(&betsToInsert).Error
}

func (r *CasinoRepository) GetCasinoAccountById(userId uint) (*models.CasinoAccount, error) {
	var casinoAccount models.CasinoAccount
	err := r.db.First(&casinoAccount, "account_id = ?", userId).Error
	if err != nil {
		return nil, err
	}

	return &casinoAccount, nil
}

func (r *CasinoRepository) GetBetsByRound(roundID int64) ([]models.DiceBet, error) {
	var diceBets []models.DiceBet
	err := r.db.Where("round_id = ?", roundID).Find(&diceBets).Error
	if err != nil {
		return nil, err
	}

	return diceBets, nil
}

func (r *CasinoRepository) UpdateCasinoAccount(account *models.CasinoAccount) error {
	return r.db.Save(account).Error
}

func (r *CasinoRepository) UpdateCasinoAccountBalance(userId uint, amount int64) error {
	return r.db.Model(&models.CasinoAccount{}).Where("account_id = ?", userId).UpdateColumn("balance", gorm.Expr("balance + ?", amount)).Error
}

func (r *CasinoRepository) UpdateRollADiceRound(roundID int64, dice1, dice2 int) error {
	return r.db.Model(&models.DiceRound{}).Where("id = ?", roundID).Updates(map[string]interface{}{"dice1": dice1, "dice2": dice2}).Error
}
