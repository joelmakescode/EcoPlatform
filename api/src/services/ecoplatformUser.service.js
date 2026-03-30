const pool = require('../config/database');
const {hashPassword} = require("./handler/passwordhash.handler");

async function insertEcoplatformUser(username, password) {
    const passwordHash = await hashPassword(password);

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