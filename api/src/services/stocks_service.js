const pool = require('../db/db')

async function getAllStocks() {
    const result = await pool.query('SELECT * FROM stocks');
    return result.rows;
}

module.exports = { getAllStocks };