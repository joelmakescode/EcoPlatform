import { database } from "../databasequeries/database.js";
import { errorLog } from "../logs/logger.js";


/**
 * Validates the roles of the user and gives access to hidden endpoints.
 * 
 * @param {string} userId 
 * @param {Array} neededRoles must be written in lower case
 * @returns {boolean}
 */
export function validateRoles(interaction, neededRoles) {
    const userId = interaction.user.id;
    const userData = database.prepare('SELECT roles FROM user_roles WHERE id = ?').get(userId);

    if (!userData) return errorLog("No UserData found", interaction);

    const roles = JSON.parse(userData.roles);

    for (const role of roles) {
        if (neededRoles.includes(role)) return true;
    }

    return false;
}