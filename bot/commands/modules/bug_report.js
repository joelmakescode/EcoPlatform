import { MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { translate } from "../../helper/translator.js";
import { errorLog } from "../../logs/logger.js";
import { handleRemoveBugReportChannel, handleSetBugReportChannel } from "../../handler/handleBugReportChannel.js";


export default {
    data: new SlashCommandBuilder()
        .setName('bug_report')
        .setDescription('Bug Report System for the Admin of the Bot.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

        .addSubcommandGroup(group => 
            group
                .setName('channel')
                .setDescription('Channel configuration')

                .addSubcommand(subcommand =>
                    subcommand
                        .setName('set')
                        .setDescription('Set Bug Report Channel')
                )

                .addSubcommand(subcommand => 
                    subcommand
                        .setName('remove')
                        .setDescription('Remove Bug Report Channel')
                )
        ),

    async execute(interaction) {
        const userId = interaction.user.id;
        
        try {

            if (userId === '906296096995823616') {
                const subcommand = interaction.options.getSubcommand();
                await handlers[subcommand](interaction);
            } else {
                await interaction.reply({ content: translate(userId, 'admin_content.bugReportChannelPermissionDeniedContent'), flags: MessageFlags.Ephemeral });
            }

        } catch (error) {
            errorLog(error, interaction);
            await interaction.reply({ content: translate(userId, 'admin_content.failedContent'), flags: MessageFlags.Ephemeral });
        }
    }
}

const handlers = {
    set: async (interaction) => {
        await handleSetBugReportChannel(interaction);
    },
    remove: async (interaction) => {
        await handleRemoveBugReportChannel(interaction);
    }
}