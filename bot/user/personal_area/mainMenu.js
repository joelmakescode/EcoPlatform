import { ActionRowBuilder } from "discord.js";
import { translate } from "../../helper/translator.js";
import { errorLog } from "../../logs/logger.js";
import { createMenu, determineMenu } from "../../helper/menuHelper.js";
import { showSettingsMenu } from "./settingsMenu.js";
import { showBankAccountMenu } from "./bankAccountMenu.js";
import { showCasinoMenu } from "./casinoMenu.js";

export async function showMainMenu(interaction, content) {
    const userId = interaction.user.id;

    const mainMenu = await determineMenu(userId, 'main_menu');
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

        case 'casino':

            await showCasinoMenu(interaction);
            break;


        case 'settings':
            
            await showSettingsMenu(interaction);
            break;
    
        default:
            break;
    }
}