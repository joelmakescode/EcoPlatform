package repository

import (
	"backend/repository/model"

	"gorm.io/gorm"
)

type CasinoRepository struct {
	db *gorm.DB
}

func NewCasinoRepository(db *gorm.DB) *CasinoRepository {
	return &CasinoRepository{db: db}
}

func (r *CasinoRepository) CreateRollADiceRound() (*model.DiceRound, error) {
	var round model.DiceRound
	err := r.db.Create(&round).Error
	if err != nil {
		return nil, err
	}

	return &round, nil
}

func (r *CasinoRepository) CreateBet(userId uint, roundId int64, bets map[string]int64) error {
	var betsToInsert []model.DiceBet
	for key, amount := range bets {
		betsToInsert = append(betsToInsert, model.DiceBet{
			UserID:  userId,
			Amount:  amount,
			BetKey:  key,
			RoundID: roundId,
		})
	}

	return r.db.Create(&betsToInsert).Error
}

func (r *CasinoRepository) GetCasinoAccountById(userId uint) (*model.CasinoAccount, error) {
	var casinoAccount model.CasinoAccount
	err := r.db.First(&casinoAccount, "account_id = ?", userId).Error
	if err != nil {
		return nil, err
	}

	return &casinoAccount, nil
}

func (r *CasinoRepository) GetBetsByRound(roundID int64) ([]model.DiceBet, error) {
	var diceBets []model.DiceBet
	err := r.db.Where("round_id = ?", roundID).Find(&diceBets).Error
	if err != nil {
		return nil, err
	}

	return diceBets, nil
}

func (r *CasinoRepository) UpdateCasinoAccount(account *model.CasinoAccount) error {
	return r.db.Save(account).Error
}

func (r *CasinoRepository) UpdateCasinoAccountBalance(userId uint, amount int64) error {
	return r.db.Model(&model.CasinoAccount{}).Where("account_id = ?", userId).UpdateColumn("balance", gorm.Expr("balance + ?", amount)).Error
}

func (r *CasinoRepository) UpdateRollADiceRound(roundID int64, dice1, dice2 int) error {
	return r.db.Model(&model.DiceRound{}).Where("id = ?", roundID).Updates(map[string]interface{}{"dice1": dice1, "dice2": dice2}).Error
}
