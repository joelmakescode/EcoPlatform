import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { errorLog } from "../../logs/logger.js";
import { translate } from "../../helper/translator.js";
import { insertIntoAdminGuildChannelsTable, selectIdFromAdminGuildChannelsTable } from "../../databasequeries/adminGuildChannelsDatabase.js";
import { insertNewReport, selectMessageData, setReportToFinished } from "../../databasequeries/reportsDatabase.js";
import { updateUserInBankAccountTable } from "../../databasequeries/userBankAccountDatabase.js";
import { createEmbed } from "../../helper/embedHelper.js";


export async function showReportBugModal(interaction) {
    const userId = interaction.user.id;

    try {
        const modal = new ModalBuilder()
            .setCustomId('personal_area_report_a_bug_modal')
            .setTitle(translate(userId, 'report_a_bug_modal.title'))

        const textInputWhere = new TextInputBuilder()
            .setCustomId('where_input')
            .setLabel(translate(userId, 'report_a_bug_modal.where'))
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const textInputDescription = new TextInputBuilder()
            .setCustomId('description_input')
            .setLabel(translate(userId, 'report_a_bug_modal.description'))
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        modal.addComponents(textInputWhere, textInputDescription);

        await interaction.showModal(modal);
    } catch (error) {
        errorLog(error, interaction);
    }
}

export async function handleReportBugModal(interaction) {
    await interaction.deferUpdate();

    const userSubmitId = interaction.user.id;
    const whereInput = interaction.fields.getTextInputValue('where_input');
    const descriptionInput = interaction.fields.getTextInputValue('description_input');

    try {
        const finishedButton = new ButtonBuilder()
            .setCustomId('bug_report_finish')
            .setLabel('Finish')
            .setStyle(ButtonStyle.Success);

        const removeButton = new ButtonBuilder()
            .setCustomId('bug_report_remove')
            .setLabel('Remove')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder().addComponents(finishedButton, removeButton);

        const channelData = selectIdFromAdminGuildChannelsTable('bug-reports');
        if (!channelData.id) return;

        const channel = await interaction.client.channels.fetch(channelData.id);
        const message = await channel.send({ content: `Affected Aspect: \`${whereInput}\` \nDescription: \`${descriptionInput}\``, components: [row] });

        insertNewReport(message.id, userSubmitId);
    } catch (error) {
        errorLog(error, interaction);
    }
}

export async function handleBugReportButton(interaction) {
    try {
        await interaction.deferUpdate();

        const messageData = selectMessageData(interaction.message.id);
        if (!messageData) return;

        if (interaction.customId === 'bug_report_finish') {

            updateUserInBankAccountTable(messageData.reporter_id, 10);
            const user = await interaction.client.users.fetch(messageData.reporter_id);
            const embed = createEmbed(interaction, interaction.user.id, 'report_a_bug_dm.finishedTitle', 'report_a_bug_dm.finishedDescription', null, Colors.Green, null)
            await user.send({
                embeds: [embed]
            });
        
        } else if (interaction.customId === 'bug_report_remove') {

            const user = await interaction.client.users.fetch(messageData.reporter_id);
            const embed = createEmbed(interaction, interaction.user.id, 'report_a_bug_dm.removedTitle', 'report_a_bug_dm.removedDescription', null, Colors.Red, null)
            await user.send({
                embeds: [embed]
            });

        }

        setReportToFinished(interaction.message.id);
        await interaction.message.delete();
    } catch (error) {
        errorLog(error, interaction);
    }
}