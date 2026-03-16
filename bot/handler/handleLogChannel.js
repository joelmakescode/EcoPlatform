import { insertIntoGuildsLogDatabase, removeGuildsLogChannelDatabase, updateGuildsLogChannelDatabase } from "../databasequeries/guildDatabase.js";
import { MessageFlags } from "discord.js";
import { translate } from "../helper/translator.js";
import { errorLog } from "../logs/logger.js";
import { database } from "../databasequeries/database.js";


export async function handleSetLogChannel(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guildId;
    const channelId = interaction.channelId;

    try {
        const channelAlreadyInserted = logChannelExists(guildId);

        if (!channelAlreadyInserted) {
            insertIntoGuildsLogDatabase(guildId, channelId);
            await interaction.reply({ content: translate(userId, 'admin_content.logChannelSuccessfullySetContent'), flags: MessageFlags.Ephemeral });
        } else {
            updateGuildsLogChannelDatabase(guildId, channelId);
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
        const channelExists = logChannelExists(guildId);

        if (!channelExists) {
            await interaction.reply({ content: translate(userId, 'admin_content.logChannelNotSetContent'), flags: MessageFlags.Ephemeral });
        } else {
            removeGuildsLogChannelDatabase(guildId);
            await interaction.reply({ content: translate(userId, 'admin_content.logChannelSuccessfullyRemovedContent'), flags: MessageFlags.Ephemeral });
        }
    } catch (error) {
        errorLog(error, interaction);
        await interaction.reply({ content: translate(userId, 'admin_content.failedContent'), flags: MessageFlags.Ephemeral });
    }
}

export function logChannelExists(guildId) {
    const channelData = database.prepare('SELECT log_channel_id FROM guilds_log WHERE id = ?').get(guildId);
    return channelData;
}