const pool = require('../config/database');

async function insertCode(discordId) {
    const code = generateFriendCode();
    const sql = `INSERT INTO discord_codes (discord_id, code, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 MINUTE))`;
    const params = [discordId, code];

    const [result] = await pool.execute(sql, params);

    return result.affectedRows > 0 ? { info: result.info, discordId, code } : null;
}

function generateFriendCode() {
    return Math.floor(100000 + Math.random() * 900000);
}

async function selectDiscordIdByCode(code) {
    const sql = `SELECT * FROM discord_codes WHERE code = ?`;
    const params = [code];

    const [result] = await pool.execute(sql, params);

    return result[0];
}

async function removeCode(code) {
    const sql = `DELETE FROM discord_codes WHERE code = ?`;
    const params = [code];

    const [result] = await pool.execute(sql, params);

    return result.affectedRows > 0 ? { info: result.info, code } : null; 
}

module.exports = { insertCode, selectDiscordIdByCode, removeCode };