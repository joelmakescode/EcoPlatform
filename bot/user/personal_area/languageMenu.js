import { ActionRowBuilder } from "discord.js";
import { createMenu, determineMenu } from "../../helper/menuHelper.js";
import { translate } from "../../helper/translator.js";
import { errorLog } from "../../logs/logger.js";
import { showSettingsMenu } from "./settingsMenu.js";
import { getUserLanguage, setUserLanguage } from "../../api/apiClient.js";

export async function showLanguageMenu(interaction) {
    const userId = interaction.user.id;

    try {
        const languageMenu = await determineMenu(userId, 'language_menu');

        const stringSelectMenu = createMenu(languageMenu);

        const row = new ActionRowBuilder().addComponents(stringSelectMenu);

        await interaction.update({ content: `${translate(userId, 'language_menu.content')} ${whatLanguage(userId)}`, components: [row] });
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
                const isValid = validateLanguage(userId, value);    

                if (!isValid) {
                    await interaction.update({ content: `${translate(userId, 'language_menu.content')} ${whatLanguage(userId)} - ${translate(userId, 'language_menu.responseFailedContent')}`, components: [row] });
                } else {
                    const languageToChangeTo = shortLanguage(value);
                    await setUserLanguage(languageToChangeTo);
                    await interaction.update({ content: `${translate(userId, 'language_menu.content')} ${whatLanguage(userId)} - ${translate(userId, 'language_menu.responseSuccessContent')}`, components: [row] });
                }

                break;
            } catch (error) {
                errorLog(error, interaction);
                await interaction.update({ content: `${translate(userId, 'language_menu.content')} ${whatLanguage(userId)} - ${translate(userId, 'standard_menu_option.responseErrorContent')}`, components: [row] });
            }
        
        default:
            break;
    }
}

function validateLanguage(userId, value) {
    if (whatLanguage(userId).toLowerCase() === value) {
        return false;
    }

    return true;
}

function shortLanguage(value) {
    if (value === 'deutsch') return 'de';
    if (value === 'english') return 'en';
    return 'en';
}

async function whatLanguage(userId) {
    const userData = await getUserLanguage(userId);
    
    if (userData.language === 'en') return 'English';
    if (userData.language === 'de') return 'Deutsch';
    return 'English';
}
