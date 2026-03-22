import { errorLog } from "../logs/logger.js";
import { translate } from "../helper/translator.js";
import {
    createAdminChannelRequest,
    getAdminChannelIdRequest,
    patchAdminChannelRequest
} from "../api/adminChannels.request.js";
import {MessageFlags} from "discord.js";


export async function handleSetBugReportChannel(interaction) {
    const userId = interaction.user.id;

    try {
        const channelId = interaction.channelId;
        const channelName = interaction.channel?.name;

        const channelAlreadyInserted = await getAdminChannelIdRequest('bug-reports');
    

        if (!channelAlreadyInserted) {
            await createAdminChannelRequest(channelId, channelName);
            await interaction.reply({ content: translate(userId, 'admin_content.bugReportChannelSuccessfullySetContent'), flags:MessageFlags.Ephemeral })
        } else {
            await patchAdminChannelRequest(channelName, channelId);
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

        const channelExists = await getAdminChannelIdRequest(channelName);

        if (channelExists) {
            await patchAdminChannelRequest(channelName, null);
            await interaction.reply({ content: translate(userId, 'admin_content.bugReportChannelSuccessfullyRemovedContent'), flags: MessageFlags.Ephemeral });
        } else {
            await interaction.reply({ content: translate(userId, 'admin_content.bugReportChannelNotSetContent'), flags: MessageFlags.Ephemeral });
        }

    } catch (error) {
        errorLog(error, interaction);
    }
}
