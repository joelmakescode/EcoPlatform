package domain

type TransactionType string

const (
	TransactionTypeSend    TransactionType = "send"
	TransactionTypeRequest TransactionType = "request"
	TransactionTypeRefund  TransactionType = "refund"
)

type TransactionStatus string

const (
	TransactionStatusComplete  TransactionStatus = "complete"
	TransactionStatusPending   TransactionStatus = "pending"
	TransactionStatusCancelled TransactionStatus = "cancelled"
	TransactionStatusRejected  TransactionStatus = "rejected"
	TransactionStatusRefunded  TransactionStatus = "refunded"
)

type BetKey string

const (
	BetKeySeven      BetKey = "seven"
	BetKeyDouble     BetKey = "double"
	BetKeyEven       BetKey = "even"
	BetKeyOdd        BetKey = "odd"
	BetKeySmall      BetKey = "small"
	BetKeyBig        BetKey = "big"
	BetKeyDoubleEven BetKey = "double_even"
	BetKeyDoubleOdd  BetKey = "double_odd"
)

var BetMultipliers = map[BetKey]int64{
	BetKeySeven:      8,
	BetKeyDouble:     5,
	BetKeyEven:       1,
	BetKeyOdd:        1,
	BetKeySmall:      1,
	BetKeyBig:        1,
	BetKeyDoubleEven: 2,
	BetKeyDoubleOdd:  2,
}
