import { MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { errorLog } from "../logs/logger.js";
import { verifyUserRole } from "../databasequeries/userRolesDatabase.js";
import { insertUserIntoUsers } from "../databasequeries/userDatabase.js";

export async function handleRegistration(interaction) {
    try {
        const registerModal = new ModalBuilder()
            .setCustomId('personal_area_registration_modal')
            .setTitle('Registration');

        const passwordInput = new TextInputBuilder()
            .setCustomId('personal_area_register_password')
            .setLabel('Password')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        registerModal.addComponents(passwordInput);

        await interaction.showModal(registerModal);
    } catch (error) {
        errorLog(error, interaction);
    }
}

export async function validateRegistration(interaction) {
    const userId = interaction.user.id;
    
    try {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        
        await insertUserIntoUsers(interaction);
        verifyUserRole(userId);

        await interaction.editReply({ content: 'Successfully registered!' });
    } catch (error) {
        errorLog(error, interaction);
    }
}