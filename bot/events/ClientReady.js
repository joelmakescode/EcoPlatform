import { Events } from "discord.js";
import { checkForUsersTable } from "../databasequeries/userDatabase.js";
import { checkForUserRolesTable } from "../databasequeries/userRolesDatabase.js";
import { checkForGuildsLogDatabase } from "../databasequeries/guildDatabase.js";
import { checkForUserBankAccount, checkForUserBankAccountTable } from "../databasequeries/userBankAccountDatabase.js";
import { checkForAdminGuildChannelsDatabase } from "../databasequeries/adminGuildChannelsDatabase.js";
import { checkForReportsDatabase } from "../databasequeries/reportsDatabase.js";
import { checkForFriendlistDatabase } from "../databasequeries/friendlistDatabase.js";
import { checkForCodeDatabase } from "../databasequeries/codeDatabase.js";

export default {
    name: Events.ClientReady,
    once: true,

    async execute(client) {
        console.log('Ready!');

        client.user?.setPresence({ activities: [{ name: '/personal_area', type: 3 }]});

        checkForAdminGuildChannelsDatabase();
        checkForCodeDatabase();
        checkForFriendlistDatabase();
        checkForGuildsLogDatabase();
        checkForReportsDatabase();
        checkForUserBankAccountTable();
        checkForUsersTable();
        checkForUserRolesTable();

        for (const guild of client.guilds.cache.values()) {
            const members = await guild.members.fetch();
            checkForUserBankAccount(members);
        }
    }
}