USE ecoplatform;

CREATE TABLE IF NOT EXISTS link_account_codes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    account_id BIGINT UNSIGNED NOT NULL,
    code BIGINT NOT NULL,

    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (account_id) REFERENCES accounts(id),
    UNIQUE (code),
    INDEX (expires_at)
)