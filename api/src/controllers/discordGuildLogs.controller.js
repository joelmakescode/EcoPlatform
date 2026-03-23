const { insertGuildLogChannel, updateGuildLogChannel, selectGuildLogChannelByGuildId} = require("../services/discordGuildLogs.service");
const { createBadRequestResponse, createInternalServerResponse, createOKResponse, createCreatedResponse,
    createNotFoundResponse
} = require("../services/handler/status.handler");

const err = {
    ErrInternalServerError: "Internal Server Error",
    ErrNoChannelFound: "No Channel Found",
    ErrNoChannelIdGiven: "No ChannelId Given",
    ErrNoGuildIdGiven: "No GuildId Given"
};

async function createNewGuildLogChannel(req, res) {
    try {
        const { guildId, channelId } = req.body;
        if (!guildId) {
            return createBadRequestResponse(res, err.ErrNoGuildIdGiven);
        }
        if (!channelId) {
            return createBadRequestResponse(res, err.ErrNoChannelIdGiven);
        }

        const createdGuildLogChannel = await insertGuildLogChannel(guildId, channelId);
        if (!createdGuildLogChannel) {
            return createInternalServerResponse(res, err.ErrInternalServerError);
        }

        createCreatedResponse(res, createdGuildLogChannel);
    } catch (error) {
        createInternalServerResponse(res, error);
    }
}

async function getGuildLogChannel(req, res) {
    try {
        const { guildId } = req.params;
        if (!guildId) {
            return createBadRequestResponse(res, err.ErrNoGuildIdGiven);
        }

        const guildChannel = await selectGuildLogChannelByGuildId(guildId);
        if (!guildChannel) {
            return createNotFoundResponse(res, err.ErrNoChannelFound);
        }

        createOKResponse(res, guildChannel);
    } catch(error) {
        createInternalServerResponse(res, error);
    }
}

async function removeOrUpdateGuildLogChannel(req, res) {
    try {
        const { guildId, channelId } = req.body;
        if (!guildId) {
            return createBadRequestResponse(res, err.ErrNoGuildIdGiven);
        }

        const updatedGuildLog = await updateGuildLogChannel(guildId, channelId);
        if (!updateGuildLogChannel) {
            createInternalServerResponse(res, err.ErrInternalServerError);
        }
        
        createOKResponse(res, updatedGuildLog);
    } catch (error) {
        createInternalServerResponse(res, error);
    }
}

module.exports = { createNewGuildLogChannel, getGuildLogChannel, removeOrUpdateGuildLogChannel };