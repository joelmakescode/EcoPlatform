import { database } from "./database.js";


export function checkForUserBankAccountTable() {
    database.exec(`
        CREATE TABLE IF NOT EXISTS user_bank_accounts (
            id TEXT PRIMARY KEY,
            created_at TIMESTAMP,
            balance REAL
        )
    `);
}

export function checkForUserBankAccount(users) {
    for (const user of users.values()) {
        insertUserIntoBankAccountTable(user.id);
    }
}

export function selectUserBalanceAccountTable(userId) {
    const userData = database.prepare(`SELECT balance FROM user_bank_accounts WHERE id = ?`).get(userId);
    return userData.balance;
}

export function insertUserIntoBankAccountTable(userId) {
    database.prepare(`INSERT OR IGNORE INTO user_bank_accounts (id, created_at, balance) VALUES (?, ?, ?)`).run(userId, new Date().toISOString(), 0);
}

export function updateUserInBankAccountTable(userId, amount) {
    database.prepare(`UPDATE user_bank_accounts SET balance = balance + ? WHERE id = ?`).run(amount, userId);
}