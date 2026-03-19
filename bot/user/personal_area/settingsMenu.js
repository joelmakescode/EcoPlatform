import { ActionRowBuilder } from "discord.js";
import { translate } from "../../helper/translator.js";
import { errorLog } from "../../logs/logger.js";
import { createMenu, determineMenu } from "../../helper/menuHelper.js";
import { showMainMenu } from "./mainMenu.js";
import { showLanguageMenu } from "./languageMenu.js";
import { showChangePasswordModal } from "./handler/changePasswordHandler.js";
import version from '../../json/version.json' with { type: 'json' };

export async function showSettingsMenu(interaction, addedContent) {
    const userId = interaction.user.id;

    const settingsMenu = await determineMenu(userId, 'settings_menu');
    const stringSelectMenu = createMenu(settingsMenu);
    const row = new ActionRowBuilder().addComponents(stringSelectMenu);

    try {
        if (!addedContent) {
            await interaction.update({ content: translate(userId, 'settings_menu.content'), components: [row] });
        } else {
            await interaction.update({ content: `${translate(userId, 'settings_menu.content')} - ${translate(userId, addedContent)}`, components: [row] });
        }
    } catch (error) {
        errorLog(error, interaction);
        await interaction.update({ content: `${translate(userId, 'standard_menu_option.responseErrorContent')}`, components: [row] });
    }
}

export async function handleSettingsMenu(interaction) {
    const value = interaction.values[0];

    switch (value) {
        case 'back':
            
            await showMainMenu(interaction, translate(interaction.user.id, 'standard_menu_option.main_menu'));
            break;

        case 'autofill_password':

            handleAutoFillPassword(interaction);
            break;

        case 'change_password':

            await showChangePasswordModal(interaction);
            break;
        
        case 'languages':

            await showLanguageMenu(interaction);
            break;

        case 'version':

            await handleVersion(interaction);
            break;

        default:
            break;
    }
}

async function handleAutoFillPassword(interaction) {
    const userId = interaction.user.id;
    
    try {
        const userData = database.prepare(`SELECT auto_fill FROM users WHERE id = ?`).get(userId);

        if (userData.auto_fill === 0) {
            database.prepare(`UPDATE users SET auto_fill = 1 WHERE id = ?`).run(userId);
            await showSettingsMenu(interaction, 'settings_menu.responseTurnOnPasswordAutofillContent')
        } else {
            database.prepare(`UPDATE users SET auto_fill = 0 WHERE id = ?`).run(userId);
            await showSettingsMenu(interaction, 'settings_menu.responseTurnOffPasswordAutofillContent');
        }

    } catch (error) {
        errorLog(error, interaction);
        await showSettingsMenu(interaction, 'standard_menu_option.responseErrorContent');
    }
}

async function handleVersion(interaction) {
    try {
        const v = version['version'];

        await showSettingsMenu(interaction, `${translate(interaction.user.id, 'settings_menu.responseSuccessBotVersionContent')} ${v}`);
    } catch (error) {
        errorLog(error, interaction);
    }
}

