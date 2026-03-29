const pool = require('../config/database');

async function insertEcoplatformUser(username, passwordHash) {
    const sql = `INSERT IGNORE INTO ecoplatform_user_config (username, password_hash) VALUES (?, ?)`;
    const params = [username, passwordHash];

    const [result] = await pool.execute(sql, params);

    return result.affectedRows > 0 ? { info: result.info, username } : null;
}

async function selectEcoplatformUser(username) {
    const sql = `SELECT * FROM ecoplatform_user_config WHERE username = ?`;
    const params = [username];

    const [result] = await pool.execute(sql, params);

    return result[0];
}

module.exports = { insertEcoplatformUser, selectEcoplatformUser };