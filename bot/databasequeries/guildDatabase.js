import { database } from "./database.js";

export function checkForGuildsLogDatabase() {
    database.exec(`
        CREATE TABLE IF NOT EXISTS guilds_log (
            id TEXT PRIMARY KEY,
            log_channel_id TEXT,
            created_at DATETIME,
            updated_at DATETIME
        )    
    `);
}

export function insertIntoGuildsLogDatabase(guildId, logChannelId) {
    database.prepare(`INSERT OR IGNORE INTO guilds_log (id, log_channel_id, created_at, updated_at) VALUES (?, ?, ?, ?)`).run(guildId, logChannelId, new Date().toISOString(), null);
}

export function updateGuildsLogChannelDatabase(guildId, logChannelId) {
    database.prepare(`UPDATE guilds_log SET log_channel_id = ?, updated_at = ? WHERE id = ?`).run(logChannelId, new Date().toISOString(), guildId);
}

export function removeGuildsLogChannelDatabase(guildId) {
    database.prepare(`UPDATE guilds_log SET log_channel_id = ?, updated_at = ? WHERE id = ?`).run(null, new Date().toISOString(), guildId);
}
