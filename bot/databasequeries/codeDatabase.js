import { errorLog } from "../logs/logger.js";
import { database } from "./database.js";


export function checkForCodeDatabase() {
    database.exec(`
        CREATE TABLE IF NOT EXISTS codes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            code INTEGER,
            expires_at INTEGER
        )    
    `);
}

export function selectCodeData(code) {
    try {
        return database.prepare(`SELECT * FROM codes WHERE code = ?`).get(code);
    } catch (error) {
        errorLog(error, null);
    }
}

export function selectUserId(code) {
    try {
        return database.prepare(`SELECT user_id FROM codes WHERE code = ?`).get(code);
    } catch (error) {
        errorLog(error, null);
    }
}

export function selectCodeByUserId(userId) {
    try {
        return database.prepare(`SELECT 1 FROM codes WHERE user_id = ?`).get(userId);
    } catch (error) {
        errorLog(error, null);
    }
}

export function insertCode(userId, code) {
    try {
        const expiresAt = Date.now() + (30 * 60 * 1000);    
        
        database.prepare(`INSERT INTO codes (user_id, code, expires_at) VALUES (?, ?, ?)`).run(userId, code, expiresAt);
    } catch (error) {
        errorLog(error, null);
    }
}

export function removeCode(code) {
    database.prepare(`DELETE FROM codes WHERE code = ?`).run(code);
}

