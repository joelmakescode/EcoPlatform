import { database } from "./database.js";

export function checkForReportsDatabase() {
    database.exec(
        `CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            message_id TEXT,
            reporter_id TEXT,
            created_at TIMESTAMP,
            deleted_at TIMESTAMP
        )`
    )
}

export function selectMessageData(messageId) {
    return database.prepare(`SELECT * FROM reports WHERE message_id = ?`).get(messageId);
}

export function insertNewReport(messageId, reporterId) {
    database.prepare(`INSERT INTO reports (message_id, reporter_id, created_at) VALUES (?, ?, ?)`).run(messageId, reporterId, new Date().toISOString())
}

export function setReportToFinished(id) {
    database.prepare(`UPDATE reports SET deleted_at = ? WHERE message_id = ?`).run(new Date().toISOString(), id);
}