const pool = require("../config/database");

async function insertNewReport(messageId, reporterId) {
    const sql = `INSERT INTO discord_reports (message_id, reporter_id) VALUES (?, ?)`;
    const params = [messageId, reporterId];

    const [result] = await pool.execute(sql, params);
    
    return result.affectedRows > 0 ? { info: result.info, messageId, reporterId } : null;
}

async function selectReportData(messageId) {
    const sql = `SELECT * FROM discord_reports WHERE message_id = ?`;
    const params = [messageId];

    const [result] = await pool.execute(sql, params);

    return result[0];
}

async function updateReport(messageId) {
    const sql = `UPDATE discord_reports SET deleted_at = ? WHERE message_id = ?`;
    const params = [new Date(), messageId];

    const [result] = await pool.execute(sql, params);

    return result.affectedRows > 0 ? { info: result.info, messageId } : null;
}

module.exports = { insertNewReport, selectReportData, updateReport };