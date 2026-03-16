import { MessageFlags } from "discord.js";
import { insertIntoAdminGuildChannelsTable, selectIdFromAdminGuildChannelsTable, updateAdminGuildChannelsTable } from "../databasequeries/adminGuildChannelsDatabase.js";
import { errorLog } from "../logs/logger.js";
import { translate } from "../helper/translator.js";


export async function handleSetBugReportChannel(interaction) {
    const userId = interaction.user.id;

    try {
        const channelId = interaction.channelId;
        const channelName = interaction.channel?.name;

        const channelAlreadyInserted = selectFromAdminGuildChannelsTable(channelName, 'id', 'name');
    

        if (!channelAlreadyInserted) {
            insertIntoAdminGuildChannelsTable(channelId, channelName);
            await interaction.reply({ content: translate(userId, 'admin_content.bugReportChannelSuccessfullySetContent'), flags:MessageFlags.Ephemeral })
        } else {
            updateAdminGuildChannelsTable(channelId, channelName);
            await interaction.reply({ content: translate(userId, 'admin_content.bugReportChannelSuccessfullyUpdatedContent'), flags: MessageFlags.Ephemeral });
        }

    } catch (error) {
        errorLog(error, interaction);
    }
}

export async function handleRemoveBugReportChannel(interaction) {
    const userId = interaction.user.id;

    try {
        
        const channelId = interaction.channelId;
        const channelName = interaction.channel?.name;

        const channelExists = selectIdFromAdminGuildChannelsTable('bug-reports');

        if (channelExists) {
            updateAdminGuildChannelsTable(channelId, null, channelName);
            await interaction.reply({ content: translate(userId, 'admin_content.bugReportChannelSuccessfullyRemovedContent'), flags: MessageFlags.Ephemeral });
        } else {
            await interaction.reply({ content: translate(userId, 'admin_content.bugReportChannelNotSetContent'), flags: MessageFlags.Ephemeral });
        }

    } catch (error) {
        errorLog(error, interaction);
    }
}
