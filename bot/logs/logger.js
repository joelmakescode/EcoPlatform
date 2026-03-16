import { database } from "../databasequeries/database.js";


export function errorLog(error, interaction) {
    sendConsoleLogMessage(error, interaction, 'ERROR');
}

export function infoLog(message, interaction) {
    sendConsoleLogMessage(message, interaction, 'INFO');
}

export function debugLog(message, interaction) {
    sendConsoleLogMessage(message, interaction, 'DEBUG');
}

export function warnLog(message, interaction) {
    sendConsoleLogMessage(message, interaction, 'WARN');
}

function sendConsoleLogMessage(message, interaction, level) {
    if (!interaction) return;
    const userId = interaction.user.id;

    const data = {
        level: level,
        message: message,
        userId: `<@${userId}>`,
        timestamp: new Date().toISOString()
    };

    if (level === 'ERROR') {
        console.error(message);
    } else {
        console.log(JSON.stringify(data, null, 2));
    }
    
    if (interaction != null) {
        sendChannelLogMessage(data, interaction);
    }
}

async function sendChannelLogMessage(data, interaction) {
    try {
        const channelData = database.prepare('SELECT log_channel_id FROM guilds_log WHERE id = ?').get(interaction.guildId);
        if (!channelData.log_channel_id) return;

        const channel = await interaction.client.channels.fetch(channelData.log_channel_id);
        if (!channel) return; //MORE PRECISE FEEDBACK

        await channel.send({ content: JSON.stringify(data, null, 2)});
    } catch (error) {
        errorLog(error, null);
    }
}