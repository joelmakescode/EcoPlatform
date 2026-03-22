CREATE TABLE IF NOT EXISTS discord_admin_channels(
     id INT AUTO_INCREMENT PRIMARY KEY,
     channel_name VARCHAR(255) NOT NULL,
     channel_id VARCHAR(255),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP
)