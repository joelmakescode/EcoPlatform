import { MessageFlags } from "discord.js";
import { translate } from "../helper/translator.js";
import { errorLog } from "../logs/logger.js";
import { addOrUpdateGuildLogChannel, getGuildLogChannel, removeGuildLogChannel } from "../api/apiClient.js";


export async function handleSetLogChannel(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guildId;
    const channelId = interaction.channelId;

    try {
        const channelAlreadyInserted = await getGuildLogChannel(guildId);

        if (!channelAlreadyInserted) {
            await addOrUpdateGuildLogChannel(guildId, channelId);
            await interaction.reply({ content: translate(userId, 'admin_content.logChannelSuccessfullySetContent'), flags: MessageFlags.Ephemeral });
        } else {
            await addOrUpdateGuildLogChannel(guildId, channelId);
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
        const channelExists = await getGuildLogChannel(guildId);

        if (!channelExists) {
            await interaction.reply({ content: translate(userId, 'admin_content.logChannelNotSetContent'), flags: MessageFlags.Ephemeral });
        } else {
            await removeGuildLogChannel(guildId);
            await interaction.reply({ content: translate(userId, 'admin_content.logChannelSuccessfullyRemovedContent'), flags: MessageFlags.Ephemeral });
        }
    } catch (error) {
        errorLog(error, interaction);
        await interaction.reply({ content: translate(userId, 'admin_content.failedContent'), flags: MessageFlags.Ephemeral });
    }
}
