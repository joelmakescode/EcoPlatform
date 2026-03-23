import { MessageFlags } from "discord.js";
import { translate } from "../helper/translator.js";
import { errorLog } from "../logs/logger.js";
import {createNewGuildLogRequest, getGuildLogRequest, patchGuildLogRequest} from "../api/guildLogs.request.js";


export async function handleSetLogChannel(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guildId;
    const channelId = interaction.channelId;

    try {
        const channelAlreadyInserted = await getGuildLogRequest(guildId);

        if (!channelAlreadyInserted) {
            await createNewGuildLogRequest(guildId, channelId);
            await interaction.reply({ content: translate(userId, 'admin_content.logChannelSuccessfullySetContent'), flags: MessageFlags.Ephemeral });
        } else {
            await patchGuildLogRequest(guildId, channelId);
            await interaction.reply({ content: translate(userId, 'admin_content.logChannelSuccessfullyUpdatedContent'), flags: MessageFlags.Ephemeral });
        }
    } catch (error) {
        errorLog(error, interaction);
        await interaction.reply({ content: translate(userId, 'admin_content.failedContent'), flags: MessageFlags.Ephemeral });
    }

}

export async function handleRemoveLogChannel(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guildId;

    try {
        const channelExists = await getGuildLogRequest(guildId);

        if (!channelExists) {
            await interaction.reply({ content: translate(userId, 'admin_content.logChannelNotSetContent'), flags: MessageFlags.Ephemeral });
        } else {
            await patchGuildLogRequest(guildId, null);
            await interaction.reply({ content: translate(userId, 'admin_content.logChannelSuccessfullyRemovedContent'), flags: MessageFlags.Ephemeral });
        }
    } catch (error) {
        errorLog(error, interaction);
        await interaction.reply({ content: translate(userId, 'admin_content.failedContent'), flags: MessageFlags.Ephemeral });
    }
}
