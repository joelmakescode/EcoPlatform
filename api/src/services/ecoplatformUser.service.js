const pool = require('../config/database');
const {hashPassword} = require("./handler/passwordhash.handler");

async function insertEcoplatformUser(username, password) {
    const passwordHash = await hashPassword(password);
    const backUpCode = generateBackupCode();

    const sql = `INSERT IGNORE INTO ecoplatform_user_config (username, password_hash, backup_code) VALUES (?, ?)`;
    const params = [username, passwordHash, backUpCode];

    const [result] = await pool.execute(sql, params);

    return result.affectedRows > 0 ? { info: result.info, username, backUpCode } : null;
}

function generateBackupCode() {
    return Math.floor(10000000 + 90000000 * Math.random());
}

async function selectEcoplatformUser(username) {
    const sql = `SELECT * FROM ecoplatform_user_config WHERE username = ?`;
    const params = [username];

    const [result] = await pool.execute(sql, params);

    return result[0];
}

module.exports = { insertEcoplatformUser, selectEcoplatformUser };