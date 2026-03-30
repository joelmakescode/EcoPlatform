import { ActionRowBuilder } from "discord.js";
import { createMenu, determineMenu } from "../../helper/menuHelper.js";
import { errorLog } from "../../logs/logger.js";
import { translate } from "../../helper/translator.js";
import { showMainMenu } from "./mainMenu.js";
import {getUserBalanceRequest} from "../../api/user.request.js";
import {patchDiscordUserDailyClaim} from "../../api/discordUser.request.js";

export async function showBankAccountMenu(interaction, addedContent) {
    const userId = interaction.user.id;

    try {
        const bankAccountMenu = await determineMenu(userId, 'bank_account_menu');
        const stringSelectMenu = createMenu(bankAccountMenu);
        const row = new ActionRowBuilder().addComponents(stringSelectMenu);

        if (!addedContent) {
            await interaction.update({ content: translate(userId, 'bank_account_menu.content'), components: [row] });
        } else {
            await interaction.update({ content: `${translate(userId, 'bank_account_menu.content')} - ${addedContent}`, components: [row] });
        }
    } catch (error) {
        errorLog(error, interaction);
        await interaction.update({ content: translate(userId, 'standard_menu_option.responseErrorContent')});
    }
}

export async function handleBankAccountMenu(interaction) {
    const userId = interaction.user.id;
    const value = interaction.values[0];

    switch (value) {
        case 'back':

            await showMainMenu(interaction, translate(interaction.user.id, 'standard_menu_option.main_menu'));
            break;

        case 'account_balance':

            const balance = await getUserBalanceRequest(userId);
            await showBankAccountMenu(interaction, `${translate(userId, 'bank_account_menu.responseSuccessBalanceRequestContent')} ${balance.data.balance}$`);
            break;

        case 'daily_claim':

            const dailyClaimData = await patchDiscordUserDailyClaim(userId);
            if (!dailyClaimData.data) {
               return await showBankAccountMenu(interaction, translate(userId, 'bank_account_menu.responseFailedDailyClaimRequestContent'));
            }

            await showBankAccountMenu(interaction, translate(userId, 'bank_account_menu.responseSuccessDailyClaimRequestContent'))
            break;
    
        default:
            break;
    }
}

