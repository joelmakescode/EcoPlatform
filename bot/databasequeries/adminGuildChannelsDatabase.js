import { database } from "./database.js";


export function checkForAdminGuildChannelsDatabase() {
    database.exec(`
        CREATE TABLE IF NOT EXISTS admin_guild_channels (
            name TEXT PRIMARY KEY,
            id TEXT,
            created_at TIMESTAMP,
            updated_at TIMESTAMP
        )    
    `)
}

export function insertIntoAdminGuildChannelsTable(channelId, channelName) {
    database.prepare(`INSERT INTO admin_guild_channels (id, name, created_at, updated_at) VALUES (?, ?, ?, ?)`).run(channelId, channelName, new Date().toISOString(), null);
}

export function updateAdminGuildChannelsTable(newChannelId, channelName) {
    database.prepare(`UPDATE admin_guild_channels SET id = ?, updated_at = ? WHERE name = ?`).run(newChannelId, new Date().toISOString(), channelName);
}

export function selectIdFromAdminGuildChannelsTable(name) {
    return database.prepare(`SELECT id FROM admin_guild_channels WHERE name = ?`).get(name);
}