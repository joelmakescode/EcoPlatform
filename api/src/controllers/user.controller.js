const { createInternalServerResponse, createOKResponse, createBadRequestResponse, createNotFoundResponse, createCreatedResponse } = require("../services/handler/status.handler");
const { insertUser, selectUserBalance, updateUserBalance } = require("../services/user.service");

const err = {
    ErrNoIdAndUsernameGiven: "No DiscordId and Username given",
    ErrNoSumGiven:          "No Sum ($) given",
    ErrUserNotFound:        "User Not Found",
};

async function createUser(req, res) {
    try {
        const { discordId, username } = req.body;
        if (!discordId && !username) {
            return createBadRequestResponse(res, err.ErrNoIdAndUsernameGiven);
        }
        const newUser = await insertUser(discordId, username); 

        createCreatedResponse(res, newUser);
    } catch (error) {
        createInternalServerResponse(res, error);
    }
}

async function getUserBalance(req, res) {
    try {
        const { discordId, username } = req.query;

        if (!discordId && !username) {
            return createBadRequestResponse(res, err.ErrNoIdAndUsernameGiven);
        }

        const userData = await selectUserBalance(discordId, username);
        if (!userData) {
            return createNotFoundResponse(res, err.ErrUserNotFound);
        }

        createOKResponse(res, userData);
    } catch (error) {
        createInternalServerResponse(res, error);
    }
}

async function addUserBalance(req, res) {
    try {
        const { discordId, username, sum } = req.body;

        if (!discordId && !username) {
            return createBadRequestResponse(res, err.ErrNoIdAndUsernameGiven);
        }
        if (sum === undefined ||sum === null) {
            return createBadRequestResponse(res, err.ErrNoSumGiven);
        }

        const updatedUser = await updateUserBalance(discordId, username, sum);
        if (!updatedUser) {
            return createNotFoundResponse(res, err.ErrUserNotFound);
        }

        createOKResponse(res, updatedUser);
    } catch (error) {
        createInternalServerResponse(res, error);
    }
}

module.exports = { createUser, getUserBalance, addUserBalance };