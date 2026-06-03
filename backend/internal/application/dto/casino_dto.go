package dto

type CasinoBalanceOutput struct {
	Balance int64 `json:"balance"`
}

type CreateBetInput struct {
	Bets map[string]int64 `json:"bets"`
}
