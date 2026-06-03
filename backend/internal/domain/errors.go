package domain

import "errors"

// User Errors
var (
	ErrUserNotFound          = errors.New("user not found")
	ErrInvalidEmail          = errors.New("invalid email format")
	ErrInvalidPassword       = errors.New("invalid password")
	ErrWeakPassword          = errors.New("password must be at least 8 characters")
	ErrDuplicateEmail        = errors.New("email already registered")
	ErrUserCreateEmptyFields = errors.New("email and username cannot be empty")
	ErrPasswordNotHashed     = errors.New("failed to hash password")
	ErrCantGenerateJWTToken  = errors.New("failed to generate JWT token")
	ErrNoUserID              = errors.New("no user ID provided")
	ErrDailyAlreadyClaimed   = errors.New("daily claim already claimed today")
	ErrInvalidAccountId      = errors.New("invalid account ID")
	ErrGeneratingCode        = errors.New("failed to generate code")
	ErrFailedDBTransaction   = errors.New("failed database transaction")
)

// Transaction Errors
var (
	ErrSameUser               = errors.New("sender and receiver cannot be the same")
	ErrNoUsername             = errors.New("username cannot be empty")
	ErrInsufficientBalance    = errors.New("insufficient balance")
	ErrMoneyNotSend           = errors.New("money transfer failed")
	ErrInvalidTransactionType = errors.New("invalid transaction type")
	ErrInvalidUUID            = errors.New("invalid UUID")
)

// Casino Errors
var (
	ErrInvalidAmount          = errors.New("invalid amount")
	ErrInvalidStake           = errors.New("invalid stake")
	ErrStakeOptionDoesntExist = errors.New("stake option doesn't exist")
	ErrGameNotInitialized     = errors.New("game not initialized")
)

// Auth Errors
var (
	ErrInvalidEmailOrPassword     = errors.New("invalid email or password")
	ErrForbidden                  = errors.New("forbidden")
	ErrInvalidDiscordIdOrPassword = errors.New("invalid discord ID or password")
	ErrNoDiscordUserID            = errors.New("no discord user ID")
	ErrUniqueConstraint           = errors.New("unique constraint violation")
)
