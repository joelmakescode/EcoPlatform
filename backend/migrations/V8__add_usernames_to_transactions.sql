USE ecoplatform;

ALTER TABLE transactions ADD COLUMN sender_username VARCHAR(15) NOT NULL AFTER sender_id;
ALTER TABLE transactions ADD COLUMN receiver_username VARCHAR(15) NOT NULL AFTER receiver_id;