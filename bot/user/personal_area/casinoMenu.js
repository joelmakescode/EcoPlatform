import {errorLog} from "../../logs/logger.js";
import {createMenu, determineMenu} from "../../helper/menuHelper.js";
import {ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle} from "discord.js";
import {translate} from "../../helper/translator.js";
import {showMainMenu} from "./mainMenu.js";
import {getUserBalanceRequest, patchUserBalanceRequest} from "../../api/user.request.js";


export async function showCasinoMenu(interaction) {
    try {
        const userId = interaction.user.id;

        const casinoMenu = await determineMenu(userId, 'casino_menu');
        const stringSelectMenu = createMenu(casinoMenu);
        const row = new ActionRowBuilder().addComponents(stringSelectMenu);

        const menuContent = translate(userId, 'casino_menu.content');

        await interaction.update({ content: menuContent, components: [row] });
    } catch(error) {
        errorLog(error);
    }
}

export async function handleCasinoMenu(interaction) {
    try {
        const value = interaction.values[0];
        const userId = interaction.user.id;

        switch (value) {
            case 'back':

                await showMainMenu(interaction, translate(userId, 'standard_menu_option.main_menu'));
                break;

            case 'gamble':

                await showCasinoGambleMenu(interaction);
                break;

            default:

                break;
        }
    } catch(error) {
        errorLog(error);
    }
}

async function showCasinoGambleMenu(interaction, addedContent) {
    try {
        const userId = interaction.user.id;

        const casinoGambleMenu = await determineMenu(userId, 'casino_gamble_menu');
        const casinoGambleStringSelect = createMenu(casinoGambleMenu);
        const row = new ActionRowBuilder().addComponents(casinoGambleStringSelect);
        const menuContent = translate(userId, 'casino_gamble_menu.content');

        if (addedContent) {
            await interaction.update({ content: `${menuContent} - ${addedContent}`, components: [row] });
        } else {
            await interaction.update({ content: menuContent, components: [row] });
        }
    } catch(error) {
        errorLog(error);
    }
}

export async function handleCasinoGambleMenu(interaction) {
    try {
        const value = interaction.values[0];
        const userId = interaction.user.id;

        if (value === 'back') {
            return await showCasinoMenu(interaction);
        }

        if (value === 'individual_amount') {
            return showIndividualAmountModal(interaction);
        }

        const amount = Number(value);

        if (!isNaN(amount)) {
            return await sendGambleRequest(interaction, amount);
        }
    } catch(error) {
        errorLog(error);
    }
}

async function showIndividualAmountModal(interaction) {
    try {
        const userId = interaction.user.id;

        const modal = new ModalBuilder()
            .setCustomId('personal_area_individual_amount_gamble')
            .setTitle(translate(userId, 'casino_gamble_menu.responseModalTitle'));

        const textInput = new TextInputBuilder()
            .setCustomId('amount')
            .setLabel(translate(userId, 'casino_gamble_menu.responseModalLabel'))
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMinLength(0)
            .setMaxLength(4)

        modal.addComponents(textInput);

        await interaction.showModal(modal);
    } catch(error) {
        errorLog(error);
    }
}

export async function handleIndividualAmountModal(interaction) {
    try {
        const userId = interaction.user.id;
        const input = interaction.fields.getTextInputValue('amount');

        if (input < 0) {
            return await showCasinoGambleMenu(interaction, translate(userId, 'casino_gamble_menu.responseFailedTooLow'))
        }

        if (!/^\d+$/.test(input)) {
            return await showCasinoGambleMenu(interaction, translate(userId, 'casino_gamble_menu.responseFailedNaN'));
        }

        await sendGambleRequest(interaction, Number(input));
    } catch(error) {
        errorLog(error);
    }
}

async function sendGambleRequest(interaction, amount) {
    try {
        const userId = interaction.user.id;
        const userBalanceData = await getUserBalanceRequest(userId);

        if (amount > userBalanceData.data.balance) {
            return await showCasinoGambleMenu(interaction, translate(userId, 'casino_gamble_menu.responseFailedInsufficientBalance'))
        }

        await patchUserBalanceRequest(userId, -amount);

        const winOrLoss = determineWinOrLoss(amount);
        if (winOrLoss === 0) {
            return await showCasinoGambleMenu(interaction, translate(userId, 'casino_gamble_menu.responseSuccessLost'))
        } else {
            await patchUserBalanceRequest(userId, winOrLoss);
            return await showCasinoGambleMenu(interaction, `${translate(userId, 'casino_gamble_menu.responseSuccessWon')} ${winOrLoss}$`)
        }
    } catch(error) {
        errorLog(error);
    }
}

function determineWinOrLoss(amount) {
    if (Math.random() > 0.95) {
        return amount * 2;
    } else if (Math.random() > 0.8) {
        return amount * 1.8;
    } else if (Math.random < 0.5) {
        return amount * 1.25;
    } else {
        return 0;
    }
}