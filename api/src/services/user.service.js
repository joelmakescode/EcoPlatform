const pool = require("../config/database");

async function insertUser(discordId, username) {
    if (discordId) {
        const sql = `INSERT INTO users (discord_id) VALUES (?)`;
        const params = [discordId];

        const [result] = await pool.execute(sql, params);

        return {
            id: result.insertId,
            info: result.info,
            discordId
        }
    } else if (username) {
        // Part for C++ Application
    }
}

async function selectUserBalance(discordId, username) {
    if (discordId) {
        const sql = `SELECT balance FROM users WHERE discord_id = ?`;
        const params = [discordId];

        const [result] = await pool.execute(sql, params);
        if (result.length === 0) return null;

        return result[0];
    } else if (username) {
        // Part for C++ Application
    }
}

async function updateUserBalance(discordId, username, sum) {
    if (discordId) {
        const sql = `UPDATE users SET balance = balance + ? WHERE discord_id = ?`;
        const params = [sum, discordId];

        const [result] = await pool.execute(sql, params);

        return result.affectedRows > 0 ? { info: result.info, discordId, sum } : null;
    } else if (username) {
        // Part for C++ Application
    }
}


module.exports = { insertUser, selectUserBalance, updateUserBalance };