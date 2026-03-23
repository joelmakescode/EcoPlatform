const pool = require("../config/database");

async function insertGuildLogChannel(guildId, channelId) {
    const sql = `INSERT INTO discord_guild_logs (guild_id, channel_id) VALUES (?, ?)`;
    const params = [guildId, channelId];

    const [result] = await pool.execute(sql, params);

    return result.affectedRows > 0 ? { info: result.info, guildId, channelId } : null;
}

async function selectGuildLogChannelByGuildId(guildId) {
    const sql = `SELECT * FROM discord_guild_logs WHERE guild_id = ?`;
    const params = [guildId];

    const [result] = await pool.execute(sql, params);

    return result[0];
}

async function updateGuildLogChannel(guildId, channelId) {
    const sql = `UPDATE discord_guild_logs SET channel_id = ? WHERE guild_id = ?`;
    const params = [channelId, guildId];

    const [result] = await pool.execute(sql, params);

    return result.affectedRows > 0 ? { info: result.info, guildId, channelId } : null;
}

module.exports = { insertGuildLogChannel, selectGuildLogChannelByGuildId, updateGuildLogChannel };