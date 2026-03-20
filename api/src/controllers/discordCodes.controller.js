const { insertCode, selectDiscordIdByCode, removeCode } = require("../services/discordCodes.service");
const { createBadRequestResponse, createInternalServerResponse, createCreatedResponse, createNotFoundResponse, createOKResponse } = require("../services/handler/status.handler");


const err = {
    ErrInternalServer: "Internal Server Error",
    ErrNoCodeFound: "No Code Found", 
    ErrNoCodeGiven: "No Code Given",
    ErrNoDiscordId: "No DiscordId Given",
    ErrNoDiscordIdFound: "No DiscordId Found"
}

async function createNewCode(req, res) {
    try {
        const { discordId } = req.body;
        if (!discordId) {
            return createBadRequestResponse(res, err.ErrNoDiscordId);
        }

        const newCode = await insertCode(discordId);
        if (!newCode) {
            return createInternalServerResponse(res, err.ErrInternalServer);
        }

        createCreatedResponse(res, newCode);
    } catch (error) {
        createInternalServerResponse(res, error);
    }
}

async function getDiscordUserIdByCode(req, res) {
    try {
        const { code } = req.body;
        if (!code) {
            return createBadRequestResponse(res, err.ErrNoCodeGiven);
        }

        const discordId = await selectDiscordIdByCode(code);
        if (!discordId) {
            return createNotFoundResponse(res, err.ErrNoDiscordIdFound);
        }

        createOKResponse(res, discordId);
    } catch (error) {
        createInternalServerResponse(res, error);
    }
}

async function deleteCode(req, res) {
    try {
        const { code } = req.body;
        if (!code) {
            return createBadRequestResponse(res, err.ErrNoCodeGiven);
        }

        const removedCode = await removeCode(code);
        if (!removedCode) {
            return createNotFoundResponse(res, err.ErrNoCodeFound);
        }

        createOKResponse(res, removeCode);
    } catch (error) {
        createInternalServerResponse(res, error);
    }
}

module.exports = { createNewCode, getDiscordUserIdByCode, deleteCode };