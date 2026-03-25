const pool = require('../config/database');

async function selectUserByDiscordId(discordId) {
    const sql = `SELECT * FROM discord_user_config WHERE discord_id = ?`;
    const [result] = await pool.execute(sql, [discordId]);
    if (result.length === 0) return null;

    return result[0];
}

async function insertDiscordUser(discordId, passwordHash) {
    const sql = `INSERT INTO discord_user_config (discord_id, password_hash) VALUES (?, ?)`;
    const params = [discordId, passwordHash];

    const [result] = await pool.execute(sql, params);

    return {
        id: result.insertId,
        info: result.info,
        discordId,
    };
}

async function updateAutofill(discordId, autofill) {
    const sql = `UPDATE discord_user_config SET autofill = ? WHERE discord_id = ?`;
    const params = [autofill, discordId];

    const [result] = await pool.execute(sql, params);

    return {
        id: result.insertId,
        info: result.info,
        discordId,
        autofill
    }
}

async function updateLanguage(discordId, language) {
    const sql = `UPDATE discord_user_config SET language = ? WHERE discord_id = ?`;
    const params = [language, discordId];

    const [result] = await pool.execute(sql, params);

    return {
        id: result.insertId,
        info: result.info,
        discordId,
        language
    };
}

async function updatePasswordHash(discordId, passwordHash) {
    const sql = `UPDATE discord_user_config SET password_hash = ? WHERE discord_id = ?`;
    const params = [passwordHash, discordId];

    const [result] = await pool.execute(sql, params);

    return {
        id: result.insertId,
        info: result.info,
        discordId
    };
}

async function updateDailyClaim(discordId) {
    const sql = `UPDATE discord_user_config SET daily_claim = ? WHERE discord_id = ?`;
    const params = [Date.now(), discordId];

    const [result] = await pool.execute(sql, params);

    return result.affectedRows > 0 ? { info: result.info, discordId } : null;
}

module.exports = { selectUserByDiscordId, insertDiscordUser, updateAutofill, updateLanguage, updatePasswordHash, updateDailyClaim };