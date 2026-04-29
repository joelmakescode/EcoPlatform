USE ecoplatform;

CREATE TABLE IF NOT EXISTS transactions (
    id BINARY(16) NOT NULL PRIMARY KEY,
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    type VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL
);

CREATE INDEX idx_transaction_id_status ON transactions (id, status);
CREATE INDEX idx_transactions_sender_created_at ON transactions (sender_id, created_at DESC, id DESC);
CREATE INDEX idx_transactions_sender_type ON transactions (sender_id, type);
CREATE INDEX idx_transactions_sender_status ON transactions (sender_id, status);
CREATE INDEX idx_transactions_receiver_status ON transactions (receiver_id, status);