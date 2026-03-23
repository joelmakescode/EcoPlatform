import { isValidSnowflake } from "../helper/isValidSnowflake.js";
import { handleRegistration } from "./handleRegistration.js";
import { verifyPassword } from "../helper/hashHelper.js";
import { MessageFlags, ModalBuilder, TextInputStyle, TextInputBuilder } from "discord.js";
import { translate } from "../helper/translator.js";
import { showMainMenu } from "../user/personal_area/mainMenu.js";
import { errorLog, infoLog, warnLog } from "../logs/logger.js";
import {getDiscordUserRequest} from "../api/discordUser.request.js";

export async function handleLogin(interaction) {
    const userId = interaction.user.id;    
    
    try {
        if (!isValidSnowflake(userId)) return;
        const userData = await getDiscordUserRequest(userId);

        if (!userData) {
            await handleRegistration(interaction);
        } else if (userData.data.autofill === 1) {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });
            await showMainMenu(interaction, translate(userId, 'login.isValid'));
        } else {
            const loginModal = new ModalBuilder()
                .setCustomId('personal_area_login_modal')
                .setTitle(translate(userId, 'login.modalTitle'));

            const passwordInput= new TextInputBuilder()
                .setCustomId('personal_area_login_password')
                .setLabel(translate(userId, 'login.passwordModalInputLabel'))
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                .setMinLength(3)
                .setMaxLength(55);

            loginModal.addComponents(passwordInput);

            await interaction.showModal(loginModal);
        }
    } catch (error) {
        errorLog(error, interaction)
    }
}


/**
 * Validates the login.
 * 
 * @param {*} interaction 
 */
export async function validateLogin(interaction) {
    const userId = interaction.user.id;

    try {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        
        const userData = await getDiscordUserRequest(userId);
        const hashed_password = userData.data.password_hash;
        const inputPassword = interaction.fields.getTextInputValue('personal_area_login_password');

        const isValid = await verifyPassword(inputPassword, hashed_password);

        if (isValid) {
            infoLog("User successfully logged in.", interaction);
            await showMainMenu(interaction, translate(userId, 'login.isValid'));
        } else {
            warnLog("User tried to login with wrong credentials.", interaction);
            await interaction.editReply({ content: `${translate(userId, 'login.isNotValid')}` });
        }
    } catch (error) {
        errorLog(error, interaction);
    }
}