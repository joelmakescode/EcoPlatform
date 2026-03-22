CREATE TABLE IF NOT EXISTS discord_user_config (
   id INT AUTO_INCREMENT PRIMARY KEY,
   discord_id VARCHAR(255) UNIQUE,
   password_hash VARCHAR(255),
   language VARCHAR(255) DEFAULT 'en',
   autofill INT DEFAULT 0
);