const pool = require("../config/database");

async function insertGuildLogChannel(guildId, channelId) {
    const sql = `INSERT INTO guild_logs (guild_id, channel_id) VALUES (?, ?)`;
    const params = [guildId, channelId];

    const [result] = await pool.execute(sql, params);

    return result.affectedRows > 0 ? { info: result.info, guildId, channelId } : null;
}

async function updateGuildLogChannel(guildId, channelId) {
    const sql = `UPDATE guild_logs SET channel_id = ? WHERE guild_id = ?`;
    const params = [channelId, guildId];

    const [result] = await pool.execute(sql, params);

    return result.affectedRows > 0 ? { info: result.info, guildId, channelId } : null;
}

module.exports = { insertGuildLogChannel, updateGuildLogChannel };