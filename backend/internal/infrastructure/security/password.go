package security

import "golang.org/x/crypto/bcrypt"

func Hash(password string) ([]byte, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	return hash, nil
}

func ValidatePassword(input []byte, hashedPassword []byte) bool {
	err := bcrypt.CompareHashAndPassword(hashedPassword, input)
	if err != nil {
		return false
	}

	return true
}
