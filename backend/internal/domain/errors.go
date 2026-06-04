package domain

import "errors"

// Casino Errors
var (
	ErrInvalidStake           = errors.New("invalid stake")
	ErrInvalidAmount          = errors.New("invalid amount")
	ErrStakeOptionDoesntExist = errors.New("stake option doesnt exist")
)

// Database Errors
var (
	ErrFailedDBTransaction = errors.New("failed db transaction")
	ErrUniqueConstraint    = errors.New("conflict")
)

// Discord Bot Errors
var (
	ErrNoDiscordUserID            = errors.New("no Discord User Id Given")
	ErrInvalidDiscordIdOrPassword = errors.New("invalid Discord Id or Password")
	ErrInvalidLanguage            = errors.New("invalid language")
	ErrGeneratingCode             = errors.New("error generating code")
	ErrNoEntryFoundForCode        = errors.New("no entry found for code")
	ErrInvalidCode                = errors.New("invalid code")
	ErrCodeExpired                = errors.New("code expired")
	ErrCodeUsed                   = errors.New("code already used")
)

// Transaction Errors
var (
	ErrInvalidTransactionType  = errors.New("error invalid transaction type")
	ErrInsufficientBalance     = errors.New("insufficient balance")
	ErrMoneyNotSend            = errors.New("money couldn't be send")
	ErrTransactionNotCompleted = errors.New("transaction couldn't be completed")
)

// User Errors
var (
	ErrDailyAlreadyClaimed    = errors.New("daily already claimed")
	ErrInvalidAccountId       = errors.New("invalid Account Id")
	ErrInvalidEmailOrPassword = errors.New("invalid Email or Password")
	ErrInvalidPassword        = errors.New("invalid Password")
	ErrInvalidUsername        = errors.New("invalid Username")
	ErrNoUserID               = errors.New("no user id given")
	ErrNoUsername             = errors.New("username cannot be empty")
	ErrPasswordNotHashed      = errors.New("password couldn't be hashed")
	ErrSameUser               = errors.New("user cannot be the same")
	ErrUserCreateEmptyFields  = errors.New("email or Username field empty")
	ErrUserNotFound           = errors.New("user not found")
)

// Generic Errors
var (
	ErrCantGenerateJWTToken = errors.New("couldn't generate JWT Token")
	ErrCouldNotDecodeCursor = errors.New("could not decode cursor")
	ErrInvalidUUID          = errors.New("invalid uuid")

	ErrUnauthenticated = errors.New("unauthenticated")
	ErrForbidden       = errors.New("forbidden")
)
