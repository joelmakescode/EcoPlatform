package config

import "os"

type Config struct {
	Port            string
	DatabaseURL     string
	WebSocketSecret []byte
}

func LoadConfig() *Config {
	config := &Config{
		Port:            getEnv("PORT", "8080"),
		DatabaseURL:     getEnv("DATABASE_URL", "ecoplatform:1@tcp(db:3306)/ecoplatform?parseTime=true"),
		WebSocketSecret: []byte(getEnv("WEBSOCKET_SECRET", "ecoplatform")),
	}

	return config
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}

	return fallback
}
