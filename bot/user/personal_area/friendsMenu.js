import { ActionRowBuilder, Colors, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { createMenu, determineMenu } from "../../helper/menuHelper.js";
import { translate } from "../../helper/translator.js";
import { errorLog } from "../../logs/logger.js";
import { showMainMenu } from "./mainMenu.js";
import { createEmbed } from "../../helper/embedHelper.js";
import {createFriendRequest, deleteFriendRequest, getFriendlistRequest} from "../../api/friendlist.request.js";
import {createNewCodeRequest, deleteCodeRequest, getCodeRequest} from "../../api/codes.request.js";


export async function showFriendsMenu(interaction, extraContent, extraCode, newStringSelectMenu) {
    try {
        const userId = interaction.user.id;
        
        const friendsMenu = await determineMenu(userId, 'friends_menu');
        let stringSelectMenu = createMenu(friendsMenu);

        if (newStringSelectMenu) stringSelectMenu = newStringSelectMenu;

        const row = new ActionRowBuilder().addComponents(stringSelectMenu);

        if (!extraContent) {
            await interaction.update({ content: translate(userId, 'friends_menu.content'), components: [row] });
        } else if (extraContent && extraCode){
            await interaction.update({ content: `${translate(userId, 'friends_menu.content')} - ${extraContent} ${extraCode}`, components: [row] })
        } else { 
            await interaction.update({ content: `${translate(userId, 'friends_menu.content')} - ${extraContent}`, components: [row] })
        }
        
    } catch (error) {
        errorLog(error, interaction);
        await interaction.update({ content: translate(interaction.user.id, 'standard_menu_option.responseErrorContent') });
    }
}

export async function handleFriendsMenu(interaction) {
    try {
        const value = interaction.values[0];

        switch (value) {
            case 'back':
                
                await showMainMenu(interaction, translate(interaction.user.id, 'standard_menu_option.main_menu'));
                break;

            case 'add_friend':

                await handleAddFriend(interaction);
                break;

            case 'enter_code':

                await showEnterCodeModal(interaction);
                break;

            case 'friends_list':

                await showFriendlistStringSelect(interaction, null)
                break;

            case 'remove_friend':

                await showFriendlistStringSelect(interaction, 'remove_friend');
                break;
        
            default:
                break;
        }
    } catch (error) {
        errorLog(error, interaction);
    }
}

export async function handleEnterCodeModal(interaction) {
    try {
        const userId = interaction.user.id;
        const code = interaction.fields.getTextInputValue('code_input');
        const codeData = await getCodeRequest(code);

        if (!codeData) {
            await deleteCodeRequest(code);
            return await showFriendsMenu(interaction, translate(userId, 'friends_menu.responseFailedInvalidCodeContent'), null)
        }

        if (userId === codeData.data.discord_id) {
            await deleteCodeRequest(code);
            return await showFriendsMenu(interaction, translate(userId, 'friends_menu.responseFailedCantAddYourselfContent'), null);
        }

        if (Date.now() > codeData.data.expires_at) {
            await deleteCodeRequest(code);
            return await showFriendsMenu(interaction, translate(userId, 'friends_menu.responseFailedExpiredCodeEnteredContent'), null);
        }

        const friendlistData = await getFriendlistRequest(userId);
        if (friendlistData.data.includes(codeData.data.discord_id)) {
            await deleteCodeRequest(code);
            return await showFriendsMenu(interaction, translate(userId, 'friends_menu.responseFailedAlreadyFriendContent'));
        }

        if (friendlistData.data.length >= 24) {
            await deleteCodeRequest(code);
            return await showFriendsMenu(interaction, translate(userId, 'friends_menu.responseFailedYouHaveTooManyFriendsContent'));
        }

        const userFriendlistData = await getFriendlistRequest(codeData.discord_id);
        if (userFriendlistData.data.length >= 24) {
            await deleteCodeRequest(code);
            return await showFriendsMenu(interaction, translate(userId, 'friends_menu.responseFailedUserHasTooManyFriendsContent'));
        }

        await createFriendRequest(userId, codeData.data.discord_id);
        await createFriendRequest(codeData.data.discord_id, userId);

        await showFriendsMenu(interaction, `${translate(userId, 'friends_menu.responseSuccessFriendAddedContent')} - <@${codeData.data.discord_id}>`, null);

        const messageUser = await interaction.client.users.fetch(codeData.data.discord_id);
        await messageUser.send({ embeds: [createEmbed(interaction, codeData.data.discord_id, 'friend_added_dm.title', 'friend_added_dm.description', null, Colors.Green, null, `<@${userId}>`)] });

        await deleteCodeRequest(code);
    } catch (error) {
        errorLog(error, interaction);
        await interaction.update({ content: translate(interaction.user.id, 'standard_menu_option.responseErrorContent') });
    }
}

export async function handleFriendlistMenu(interaction) {
    try {
        const value = interaction.values[0];

        switch (value) {
            case 'back':
                
                await showFriendsMenu(interaction);
                break;
        
            default:

                await showFriendlistStringSelect(interaction, null);
                break;
        }
    } catch (error) {
        errorLog(error, interaction);
    }
}

export async function handleRemoveFriendFriendlistStringSelect(interaction) {
    try {
        const value = interaction.values[0];
        switch (value) {
            case 'back':
                
                await showFriendsMenu(interaction, null, null, null);
                break;
        
            default:

                const userId = interaction.user.id;
        
                await deleteFriendRequest(userId, value);
                await deleteFriendRequest(value, userId);

                await showFriendsMenu(interaction, translate(userId, 'remove_friend_friendlist_menu.responseSuccessFriendRemovedContent'), null, null);
                break;

        }
    } catch (error) {
        errorLog(error, interaction);
    }
}

async function handleAddFriend(interaction) {
    try {
        const userId = interaction.user.id;

        const codeData = await createNewCodeRequest(userId);
        await showFriendsMenu(interaction, translate(userId, 'friends_menu.responseSuccessYourCodeContent'), `\`${codeData.data.code}\``);
    } catch (error) {
        errorLog(error, interaction);
        await interaction.update({ content: translate(interaction.user.id, 'standard_menu_option.responseErrorContent') });
    }
}

async function showEnterCodeModal(interaction) {
    try {
        const userId = interaction.user.id;

        const modal = new ModalBuilder()
            .setCustomId('personal_area_friendlist_enter_code_modal')
            .setTitle(translate(userId, 'enter_code_modal.title'));

        const codeInput = new TextInputBuilder()
            .setCustomId('code_input')
            .setLabel(translate(userId, 'enter_code_modal.label'))
            .setMaxLength(6)
            .setMinLength(6)
            .setStyle(TextInputStyle.Short);

        modal.addComponents(codeInput);

        await interaction.showModal(modal);
    } catch (error) {
        errorLog(error, interaction)
    }
}

async function showFriendlistStringSelect(interaction, value) {
    try {
        const userId = interaction.user.id;
        const friendlistData = await getFriendlistRequest(userId);

        let friends = [];

        //if (friendlistData?.friendlist) {
          //  friends = JSON.parse(friendlistData.friendlist).map(f => String(f)).filter(f => f);
        //}

        if (friends.length === 0 || !friendlistData) {
            return await showFriendsMenu(interaction, translate(userId, 'friends_menu.responseFailedNoFriendsContent'), null, null);
        }

        let friendlistMenu;

        if (value === 'remove_friend') {
            friendlistMenu = await determineMenu(userId, 'remove_friend_friendlist_menu', friends);
        } else {
            friendlistMenu = await determineMenu(userId, 'friendlist_menu', friends);
        }

        const stringSelectMenu = createMenu(friendlistMenu);

        return await showFriendsMenu(interaction, translate(userId, 'friendlist_menu.responseSuccessFriendlistMenuContent'), null, stringSelectMenu);
    } catch (error) {
        errorLog(error, interaction);
    }
}