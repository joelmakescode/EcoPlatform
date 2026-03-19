import { Events } from "discord.js";
import { insertUserIntoBankAccountTable } from "../api/apiClient.js";


export default {
    name: Events.GuildMemberAdd,

    async execute(member) {
        await insertUserIntoBankAccountTable(member.id)
    }
}