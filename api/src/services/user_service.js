const pool = require('../db/db');

/**
 * Fügt einen neuen Nutzer hinzu
 */

async function createUser(username) {
    try {

        const [result] = await pool.query(
            'INSERT INTO users (username) VALUES(?)',
            [username]
        );

        const [rows] = await pool.query(
            'SELECT * FROM users WHERE id = ?',
            [result.insertId]
        );

        return rows[0];
    } catch (error) {
        console.error('DB error in createUser:', error)
        throw error;
    }
}

module.exports = { createUser };