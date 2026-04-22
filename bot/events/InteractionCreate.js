import { Events } from "discord.js";
import { validateLogin } from "../handler/handleLogin.js";
import { validateRegistration } from "../handler/handleRegistration.js";
import { handleMainMenu } from "../user/personal_area/mainMenu.js";
import { handleSettingsMenu } from "../user/personal_area/settingsMenu.js";
import { handleLanguageMenu } from "../user/personal_area/languageMenu.js";
import { validateChangePassword, validateChangePasswordBeforeLogin } from "../user/personal_area/handler/changePasswordHandler.js";
import { handleBankAccountMenu } from "../user/personal_area/bankAccountMenu.js";
import {fetchAndCacheLanguage} from "../helper/translator.js";
import {
    handleCasinoGambleMenu,
    handleCasinoMenu,
    handleIndividualAmountModal
} from "../user/personal_area/casinoMenu.js";

export default {
    name: Events.InteractionCreate,

    async execute(interaction) {
        await fetchAndCacheLanguage(interaction.user.id);

        if (interaction.isChatInputCommand()) {   
            const command = interaction.client.commands.get(interaction.commandName);
            try { 
                await command.execute(interaction);
            } catch (error) {
                console.log(error);
            }
        } else if (interaction.isModalSubmit()) {
            if (interaction.customId === 'personal_area_login_modal') await validateLogin(interaction);
            if (interaction.customId === 'personal_area_registration_modal') await validateRegistration(interaction);
            if (interaction.customId === 'personal_area_change_password_modal') await validateChangePassword(interaction);
            if (interaction.customId === 'personal_area_change_password_modal_before_login') await validateChangePasswordBeforeLogin(interaction);
            if (interaction.customId === 'personal_area_individual_amount_gamble') await handleIndividualAmountModal(interaction);
        } else if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'main_menu_string_select') await handleMainMenu(interaction);
            if (interaction.customId === 'bank_account_menu_string_select') await handleBankAccountMenu(interaction);
            if (interaction.customId === 'casino_menu_string_select') await handleCasinoMenu(interaction);
            if (interaction.customId === 'casino_gamble_menu_string_select') await handleCasinoGambleMenu(interaction);
            if (interaction.customId === 'settings_menu_string_select') await handleSettingsMenu(interaction);
            if (interaction.customId === 'language_menu_string_select') await handleLanguageMenu(interaction);
        }
    }
}