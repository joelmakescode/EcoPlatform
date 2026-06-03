package config

import (
	"os"
)

type Config struct {
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	JWTSecret  string
	AppPort    string
}

func LoadFromEnv() *Config {
	return &Config{
		DBHost:     getEnv("DB_HOST", "localhost"),
		DBPort:     getEnv("DB_PORT", "3306"),
		DBUser:     getEnv("DB_USER", "ecoplatform"),
		DBPassword: getEnv("DB_PASSWORD", "1"),
		DBName:     getEnv("DB_NAME", "ecoplatform"),
		JWTSecret:  getEnv("JWT_SECRET", "ecoplatformeudgsidbfzgsi8"),
		AppPort:    getEnv("APP_PORT", "8080"),
	}
}

func getEnv(key, defaultVal string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultVal
}
