import { Events } from "discord.js";
import client from "../client.js";
import {createNewUserRequest} from "../api/user.request.js";

export default {
    name: Events.ClientReady,
    once: true,

    async execute(client) {
        console.log('Ready!');

        await insertEveryNonExistentUser();
        client.user?.setPresence({ activities: [{ name: '/personal_area', type: 3 }]});
    }
}

async function insertEveryNonExistentUser() {
    const guild = client.guilds.cache.get("1315665248258363462");
    if (!guild) return;

    const members = await guild.members.fetch();

    for (const [, member] of members) {
        const discordId = member.user.id;
        await createNewUserRequest(discordId);
    }
}