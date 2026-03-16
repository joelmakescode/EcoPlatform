import { ActionRowBuilder } from "discord.js";
import { translate } from "../../helper/translator.js";
import { validateRoles } from "../../handler/handleRoles.js"; 
import { errorLog } from "../../logs/logger.js";
import { createMenu, determineMenu } from "../../helper/menuHelper.js";
import { showSettingsMenu } from "./settingsMenu.js";
import { showRolesMenu } from "./rolesMenu.js";
import { showBankAccountMenu } from "./bankAccountMenu.js";
import { showReportBugModal } from "./reportBugModal.js";
import { showFriendsMenu } from "./friendsMenu.js";

export async function showMainMenu(interaction, content) {
    const userId = interaction.user.id;

    const mainMenu = await determineMenu(userId, 'main_menu');

    // if (validateRoles(interaction, ['admin-DELETE-WHEN-NEEDED'])) {
    //     mainMenu.options.push({ label: `${translate(userId, 'main_menu.roles')}`, value: 'roles' });
    // }

    const stringSelectMenu = createMenu(mainMenu);

    const row = new ActionRowBuilder().addComponents(stringSelectMenu);

    try {    
        if (interaction.replied || interaction.deferred) {
            await interaction.editReply({ content: content, components: [row] });
        } else {
            await interaction.update({ content, components: [row] })
        }
    } catch (error) {
        errorLog(error, interaction)
        await interaction.update({ content: content + `${translate(userId, 'standard_menu_option.responseErrorContent')}`, components: [row] });
    }
}

export async function handleMainMenu(interaction) {
    const value = interaction.values[0];

    switch (value) {
        case 'bank_account':

            await showBankAccountMenu(interaction);
            break;

        case 'friends':

            await showFriendsMenu(interaction);
            break;

        case 'report_bug':

            await showReportBugModal(interaction);
            break;

        case 'roles':

            showRolesMenu(interaction);
            break;

        case 'settings':
            
            showSettingsMenu(interaction);
            break;
    
        default:
            break;
    }
}