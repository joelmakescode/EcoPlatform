import { Events } from "discord.js";
import { insertUserIntoBankAccountTable } from "../databasequeries/userBankAccountDatabase.js";


export default {
    name: Events.GuildMemberAdd,

    async execute(member) {
        insertUserIntoBankAccountTable(member.id)
    }
}