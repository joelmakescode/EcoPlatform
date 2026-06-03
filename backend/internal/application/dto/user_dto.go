package dto

type BalanceOutput struct {
	Balance int64 `json:"balance"`
}

type CreateUserInput struct {
	Email    string `json:"email"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type CreateUserOutput struct {
	ID       uint   `json:"id"`
	Email    string `json:"email"`
	Username string `json:"username"`
}

type DailyClaimStatusOutput struct {
	CanClaim bool `json:"can_claim"`
}

type LinkCodeOutput struct {
	Code string `json:"code"`
}

type UserOutput struct {
	ID       uint   `json:"id"`
	Email    string `json:"email"`
	Username string `json:"username"`
}
