import users from '../json/roleSystem/users.json' with { type: "json" };
import { errorLog } from '../logs/logger.js';
import { database } from './database.js';

export function checkForUserRolesTable() {
    database.exec(`
        CREATE TABLE IF NOT EXISTS user_roles (
            id TEXT PRIMARY KEY,
            roles TEXT
        )    
    `);

    insertUsersWithRoles();
}

export function verifyUserRole(userId) {
    database.prepare(`INSERT OR IGNORE INTO user_roles (id, roles) VALUES (?, ?)`).run(userId, "['verified']");
}

function insertUsersWithRoles() {
    try {
        const insertStatement = database.prepare(`
            INSERT OR IGNORE INTO user_roles (id, roles) VALUES (?, ?)
        `);

        const insert = database.transaction(() => {
            for (const username in users) {
                const user = users[username];

                insertStatement.run(user.id, JSON.stringify(user.roles));
            }
        });

        insert();
    } catch (error) {
        errorLog(error, null)
    }
}