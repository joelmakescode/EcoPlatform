package security

import "golang.org/x/crypto/bcrypt"

type BCryptHasher struct{}

func NewBCryptHasher() *BCryptHasher {
	return &BCryptHasher{}
}

func (h *BCryptHasher) Hash(password string) (string, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(hashed), err
}

func (h *BCryptHasher) Compare(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
