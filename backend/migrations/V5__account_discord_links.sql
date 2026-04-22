USE ecoplatform;

CREATE TABLE IF NOT EXISTS account_discord_links(
    account_id BIGINT UNSIGNED NOT NULL,
    discord_user_id VARCHAR(255) NOT NULL UNIQUE,

    linked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (account_id, discord_user_id),
    UNIQUE(discord_user_id),

    FOREIGN KEY (account_id) REFERENCES accounts(id),
    FOREIGN KEY (discord_user_id) REFERENCES discord_users(discord_id)
);