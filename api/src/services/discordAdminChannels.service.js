const pool = require('../config/database');

async function insertAdminChannel(channelName, channelId) {
    const sql = `INSERT INTO discord_admin_channels (channel_name, channel_id) VALUES (?, ?)`;
    const params = [channelName, channelId];

    const [result] = await pool.execute(sql, params);

    return result.affectedRows > 0 ? { id: result.insertId, info: result.info, channelName, channelId } : null;
}

async function selectChannelIdByName(channelName) {
    const sql = `SELECT channel_id FROM discord_admin_channels WHERE channel_name = ?`;
    const params = [channelName];

    const [result] = await pool.execute(sql, params);
    if (result.length === 0) {
        return { info: "Conflict" };
    }

    return result[0];
}

async function updateChannelIdByName(channelName, channelId) {
    const sql = `UPDATE discord_admin_channels SET channel_id = ? WHERE channel_name = ?`;
    const params = [channelId, channelName];

    const [result] = await pool.execute(sql, params);

    return result.affectedRows > 0 ? { info: result.info, channelName, channelId } : null;
}

module.exports = { insertAdminChannel, selectChannelIdByName, updateChannelIdByName };