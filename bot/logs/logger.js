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
}
