const pool = require('../config/database');

async function insertNewFriend(discordId, discordFriendId) {
    const friendsAlready = selectFriendById(discordId, discordFriendId);
    if (friendsAlready) {
        return { info: 'Conflict' };
    }

    const sql = `INSERT INTO discord_friends (discord_id, friend_discord_id) VALUES (?, ?)`;
    const firstParams = [discordId, discordFriendId];
    const secondParams = [discordFriendId, discordId];

    const [result1] = await pool.execute(sql, firstParams);
    const [result2] = await pool.execute(sql, secondParams);

    if (result1.affectedRows + result2.affectedRows === 0) {
        return null;
    }

    return { info: "Friendship added", inserts: { forward: result1.affectedRows, reverse: result2.affectedRows }, discordId, discordFriendId };
}

async function selectFriendById(discordId, discordFriendId) {
    const sql = `SELECT 1 FROM discord_friends WHERE discord_id = ? AND friend_discord_id = ?`;
    const params = [discordId, discordFriendId];

    const [result] = await pool.execute(sql, params);

    return result.length > 0;
}

async function selectFriendlistById(discordId) {
    const sql = `SELECT * FROM discord_friends WHERE discord_id = ?`;
    const params = [discordId];

    const [result] = await pool.execute(sql, params);

    return result.map(row => row.friend_discord_id);
}

async function removeFriend(discordId, discordFriendId) {
    const sql = `DELETE FROM discord_friends WHERE discordId = ? AND friend_discord_id = ?`;
    const firstParams = [discordId, discordFriendId];
    const secondParams = [discordFriendId, discordId];

    const [result1] = await pool.execute(sql, firstParams);
    const [result2] = await pool.execute(sql, secondParams);

    if (result1.affectedRows + result2.affectedRows === 0) {
        return null;
    }

    return { info: "Friendship removed", deletions: { forward: result1.affectedRows, reverse: result2.affectedRows }, discordId, discordFriendId };
}

module.exports = { insertNewFriend, selectFriendById, selectFriendlistById, removeFriend };