import { hashPassword } from '../helper/hashHelper.js';
import { database } from './database.js';

export function checkForUsersTable() {
    database.exec(
        `CREATE TABLE IF NOT EXISTS users
        (
            id TEXT PRIMARY KEY,
            password_hash TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            language TEXT,
            auto_fill INTEGER
        );`
    );
}

export async function insertUserIntoUsers(interaction) {
    const passwordInput = interaction.fields.getTextInputValue('personal_area_register_password');
    const hashedPassword = await hashPassword(passwordInput);
    const now = new Date();

    database.prepare('INSERT INTO users (id, password_hash, created_at, language, auto_fill) VALUES (?, ?, ?, ?, ?)').run(interaction.user.id, hashedPassword, now.toISOString(), 'en', 0);
}

export async function updateUserPasswordHash(userId, input) {
    const hashedPassword = await hashPassword(input);
    database.prepare(`UPDATE users SET password_hash = ? WHERE id = ?`).run(hashedPassword, userId);
}