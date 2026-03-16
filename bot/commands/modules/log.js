import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { handleRemoveLogChannel, handleSetLogChannel } from "../../handler/handleLogChannel.js";


export default {
    data: new SlashCommandBuilder()
        .setName('log')
        .setDescription('Logging System for your Server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

        .addSubcommandGroup(group => 
            group
                .setName('channel')
                .setDescription('Channel configuration')

                .addSubcommand(sub => 
                    sub
                        .setName('set')
                        .setDescription('Set Log Channel')
                )

                .addSubcommand(sub => 
                    sub
                        .setName('remove')
                        .setDescription('Removes the Log Channel')
                )
        ),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        await handlers[subcommand](interaction);
    }
}

const handlers = {
    set: async (interaction) => {
        await handleSetLogChannel(interaction);
    },
    remove: async (interaction) => {
        await handleRemoveLogChannel(interaction);
    }
}