import { ActionRowBuilder } from "discord.js";
import { createMenu, determineMenu } from "../../helper/menuHelper.js";
import { translate } from "../../helper/translator.js";
import { errorLog } from "../../logs/logger.js";
import { showSettingsMenu } from "./settingsMenu.js";
import { getDiscordUserRequest, putDiscordUserLanguage } from "../../api/discordUser.request.js";

export async function showLanguageMenu(interaction) {
    const userId = interaction.user.id;

    try {
        const languageMenu = await determineMenu(userId, 'language_menu');

        const stringSelectMenu = createMenu(languageMenu);

        const row = new ActionRowBuilder().addComponents(stringSelectMenu);

        await interaction.update({ content: `${translate(userId, 'language_menu.content')} ${await whatLanguage(userId)}`, components: [row] });
    } catch (error) {
        errorLog(error, interaction);
    }
}

export async function handleLanguageMenu(interaction) {
    const value = interaction.values[0];
    const userId = interaction.user.id;

    switch (value) {
        case 'back':
            
            await showSettingsMenu(interaction);
            break;
        
        case 'deutsch':
        case 'english':

            const languageMenu = await determineMenu(userId, 'language_menu');
            const stringSelectMenu = createMenu(languageMenu);
            const row = new ActionRowBuilder().addComponents(stringSelectMenu);
            
            try {
                const isValid = await validateLanguage(userId, value);

                if (!isValid) {
                    await interaction.update({ content: `${translate(userId, 'language_menu.content')} ${await whatLanguage(userId)} - ${translate(userId, 'language_menu.responseFailedContent')}`, components: [row] });
                } else {
                    const languageToChangeTo = shortLanguage(value);
                    await putDiscordUserLanguage(userId, languageToChangeTo);
                    await interaction.update({ content: `${translate(userId, 'language_menu.content')} ${await whatLanguage(userId)} - ${translate(userId, 'language_menu.responseSuccessContent')}`, components: [row] });
                }

                break;
            } catch (error) {
                errorLog(error, interaction);
                await interaction.update({ content: `${translate(userId, 'language_menu.content')} ${await whatLanguage(userId)} - ${translate(userId, 'standard_menu_option.responseErrorContent')}`, components: [row] });
            }
        
        default:
            break;
    }
}

async function validateLanguage(userId, value) {
    const current = await whatLanguage(userId);

    if (typeof current !== "string") {
        console.error("whatLanguage returned:", current);
        return false;
    }

    return current.toLowerCase() !== value;
}

function shortLanguage(value) {
    if (value === 'deutsch') return 'de';
    if (value === 'english') return 'en';
    return 'en';
}

async function whatLanguage(userId) {
    const userData = await getDiscordUserRequest(userId);

    if (!userData || !userData.data.language) return 'English';

    if (userData.data.language === 'en') return 'English';
    if (userData.data.language === 'de') return 'Deutsch';

    return 'English';
}
