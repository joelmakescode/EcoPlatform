import { Events } from "discord.js";
import {createNewUserRequest} from "../api/user.request.js";

export default {
    name: Events.GuildMemberAdd,

    async execute(member) {
        await createNewUserRequest(member.id);
    }
}