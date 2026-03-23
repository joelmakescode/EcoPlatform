const { insertNewFriend, selectFriendlistById, removeFriend } = require("../services/discordFriendlist.service");
const { createBadRequestResponse, createInternalServerResponse, createCreatedResponse, createConflictResponse, createOKResponse, createNotFoundResponse } = require("../services/handler/status.handler");

const err = {
    ErrAlreadyFriends: "Users Are Already Friends",
    ErrInternalServerError: "Internal Server Error",
    ErrNoDiscordFriendIdGiven: "No DiscordFriendId Given",
    ErrNoDiscordIdGiven: "No DiscordId Given",
    ErrNoFriends: "User doesn't have any friends",
    ErrNotFriends: "Users not found or are not friends"
};

async function createNewFriend(req, res) {
    try {
        const { discordId, discordFriendId } = req.body;

        if (!discordId) {
            return createBadRequestResponse(res, err.ErrNoDiscordIdGiven);
        }
        if (!discordFriendId) {
            return createBadRequestResponse(res, err.ErrNoDiscordFriendIdGiven);
        }

        const newFriend = await insertNewFriend(discordId, discordFriendId);
        if (newFriend?.info === 'Conflict') {
            return createConflictResponse(res, err.ErrAlreadyFriends);
        }
        if (!discordFriendId) {
            return createInternalServerResponse(res, err.ErrInternalServerError);
        }

        createCreatedResponse(res, newFriend);
    } catch (error) {
        createInternalServerResponse(res, error);
    }
}

async function getFriendlist(req, res) {
    try {
        const { discordId } = req.params;

        if (!discordId) {
            return createBadRequestResponse(res, err.ErrNoDiscordIdGiven);
        }

        const friendlist = await selectFriendlistById(discordId);
        if (!friendlist.length) {
            return createNotFoundResponse(res, err.ErrNoFriends);
        }

        createOKResponse(res, friendlist);
    } catch (error) {
        createInternalServerResponse(res, error);
    }
}

async function deleteFriend(req, res) {
    try {
        const { discordId, discordFriendId } = req.body;

        if (!discordId) {
            return createBadRequestResponse(res, err.ErrNoDiscordIdGiven);
        }
        if (!discordFriendId) {
            return createBadRequestResponse(res, err.ErrNoDiscordFriendIdGiven);
        }

        const removedFriend = await removeFriend(discordId, discordFriendId);
        if (!removedFriend) {
            return createNotFoundResponse(res, err.ErrNotFriends);
        }

        createOKResponse(res, removedFriend);
    } catch (error) {
        createInternalServerResponse(res, error);
    }
}

module.exports = { createNewFriend, getFriendlist, deleteFriend };