import { Events } from "discord.js";

export default {
    name: Events.ClientReady,
    once: true,

    async execute(client) {
        console.log('Ready!');
        client.user?.setPresence({ activities: [{ name: '/personal_area', type: 3 }]});
    }
}