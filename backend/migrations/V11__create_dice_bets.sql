USE ecoplatform;

CREATE TABLE dice_bets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    round_id BIGINT NOT NULL,

    bet_key VARCHAR(255) NOT NULL,
    amount BIGINT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (round_id) REFERENCES dice_rounds(id)
);