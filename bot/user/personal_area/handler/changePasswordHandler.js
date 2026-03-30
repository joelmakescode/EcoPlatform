import { MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { translate } from "../../../helper/translator.js";
import { errorLog } from "../../../logs/logger.js";
import { showSettingsMenu } from "../settingsMenu.js";
import {patchDiscordUserPassword} from "../../../api/discordUser.request.js";

export async function showChangePasswordModal(interaction) {
    const userId = interaction.user.id;

    const modal = new ModalBuilder()
        .setCustomId('personal_area_change_password_modal')
        .setTitle(translate(userId, 'change_password_modal.title'));

    const textInput = new TextInputBuilder()
        .setCustomId('change_password_input')
        .setLabel(translate(userId, 'change_password_modal.label'))
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMinLength(3)
        .setMaxLength(55);

    modal.addComponents(textInput);

    try {
        await interaction.showModal(modal);
    } catch (error) {
        errorLog(error, interaction);
        //Add User Response
    }
}

export async function showChangePasswordModalBeforeLogin(interaction) {
    const userId = interaction.user.id;

    const modal = new ModalBuilder()
        .setCustomId('personal_area_change_password_modal_before_login')
        .setTitle(translate(userId, 'change_password_modal.title'));

    const textInput = new TextInputBuilder()
        .setCustomId('change_password_input')
        .setLabel(translate(userId, 'change_password_modal.label'))
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMinLength(3)
        .setMaxLength(55);

    modal.addComponents(textInput);

    try {
        await interaction.showModal(modal);
    } catch (error) {
        errorLog(error, interaction);
        //Add User Response
    }
}

export async function validateChangePassword(interaction) {
    const userId = interaction.user.id;
    const input = interaction.fields.getTextInputValue('change_password_input');

    try {
        const updatedUser = await patchDiscordUserPassword(userId, input);

        if (updatedUser.status === 409) {
            await showSettingsMenu(interaction, 'settings_menu.responseFailedPasswordChangeContent');
        } else {
            await showSettingsMenu(interaction, 'settings_menu.responseSuccessPasswordChangeContent');
        }
    } catch (error) {
        errorLog(error, interaction);
        await showSettingsMenu(interaction, 'standard_menu_option.responseErrorContent');
    }
}

export async function validateChangePasswordBeforeLogin(interaction) {
    try {
        const userId = interaction.user.id;
        const input = interaction.fields.getTextInputValue('change_password_input');

        const updatedUser = await patchDiscordUserPassword(userId, input);

        if (updatedUser.status === 409) {
            await interaction.reply({ content: translate(userId, 'change_password_modal.responseFailedPasswordChangeContent'), flags: MessageFlags.Ephemeral });
        } else {
            await interaction.reply({ content: translate(userId, 'change_password_modal.responseSuccessPasswordChangeContent'), flags: MessageFlags.Ephemeral });
        }
    } catch (error) {
        errorLog(error, interaction);
    }
}
