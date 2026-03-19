import { MessageFlags } from "discord.js";
import { errorLog } from "../logs/logger.js";
import { translate } from "../helper/translator.js";
import { addOrUpdateAdminChannel, getAdminChannelId } from "../api/apiClient.js";


export async function handleSetBugReportChannel(interaction) {
    const userId = interaction.user.id;

    try {
        const channelId = interaction.channelId;
        const channelName = interaction.channel?.name;

        const channelAlreadyInserted = await getAdminChannelId('bug-reports');
    

        if (!channelAlreadyInserted) {
            await addOrUpdateAdminChannel(channelId, channelName);
            await interaction.reply({ content: translate(userId, 'admin_content.bugReportChannelSuccessfullySetContent'), flags:MessageFlags.Ephemeral })
        } else {
            await addOrUpdateAdminChannel(channelId, channelName);
            await interaction.reply({ content: translate(userId, 'admin_content.bugReportChannelSuccessfullyUpdatedContent'), flags: MessageFlags.Ephemeral });
        }

    } catch (error) {
        errorLog(error, interaction);
    }
}

export async function handleRemoveBugReportChannel(interaction) {
    const userId = interaction.user.id;

    try {
        const channelName = interaction.channel?.name;

        const channelExists = await getAdminChannelId('bug-reports');

        if (channelExists) {
            await addOrUpdateAdminChannel(null, channelName);
            await interaction.reply({ content: translate(userId, 'admin_content.bugReportChannelSuccessfullyRemovedContent'), flags: MessageFlags.Ephemeral });
        } else {
            await interaction.reply({ content: translate(userId, 'admin_content.bugReportChannelNotSetContent'), flags: MessageFlags.Ephemeral });
        }

    } catch (error) {
        errorLog(error, interaction);
    }
}
