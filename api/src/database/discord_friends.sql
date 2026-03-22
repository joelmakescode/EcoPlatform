CREATE TABLE IF NOT EXISTS discord_friends(
    id INT AUTO_INCREMENT PRIMARY KEY,
    discord_id VARCHAR(255) NOT NULL,
    friend_discord_id VARCHAR(255) NOT NULL,
    UNIQUE(discord_id, friend_discord_id)
);