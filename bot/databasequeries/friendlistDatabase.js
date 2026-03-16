import { errorLog } from "../logs/logger.js";
import { database } from "./database.js";


export function checkForFriendlistDatabase() {
    database.exec(`
        CREATE TABLE IF NOT EXISTS friendlists (
            user_id TEXT PRIMARY KEY,
            friendlist TEXT
        )    
    `);
}

export function selectFriendlist(userId) {
    return database.prepare(`SELECT friendlist FROM friendlists WHERE user_id = ?`).get(userId);
}

export function insertFriendIntoFriendlist(userId, friendId) {
    try {
        database.prepare(`INSERT OR IGNORE INTO friendlists (user_id, friendlist) VALUES (?, ?)`).run(userId, JSON.stringify([friendId]));
    } catch (error) {
        errorLog(error, null)
    }
}

export function addFriendIntoFriendlist(userId, friendId) {
    try {
        let friends = getFriendlist(userId);

        if (!friends.includes(friendId)) {
            friends.push(friendId);
        }

        updateFriendlist(friends, userId);
    } catch (error) {
        errorLog(error, null);
    }
}

export function removeFriendFromFriendlist(userId, friendId) {
    try {
        let friends = getFriendlist(userId);

        friends = friends.filter(id => id !== friendId);

        updateFriendlist(friends, userId);
    } catch (error) {
        errorLog(error, null)
    }
}

function updateFriendlist(friends, userId) {
    database.prepare(`UPDATE friendlists SET friendlist = ? WHERE user_id = ?`).run(JSON.stringify(friends), userId);
}

export function getFriendlist(userId) {
    const userData = selectFriendlist(userId);
    let friends = [];

    if (userData && userData.friendlist) {
        friends = JSON.parse(userData.friendlist);
    }

    return friends;
}