const {createInternalServerResponse, createBadRequestResponse, createCreatedResponse, createNotFoundResponse,
    createOKResponse
} = require("../services/handler/status.handler");
const { insertAdminChannel, selectChannelIdByName, updateChannelIdByName} = require('../services/discordAdminChannels.service');

const err = {
    ErrInternalServer: 'Internal Server Error',
    ErrNoChannelFound: 'No Channel Found By Name',
    ErrNoChannelIdGiven: 'No ChannelId Given',
    ErrNoChannelNameGiven: 'No ChannelName Given'
}

async function createAdminChannel(req, res) {
    try {
        const { channelId, channelName } = req.body;
        if (!channelId) {
            return createBadRequestResponse(res, err.ErrNoChannelIdGiven);
        }
        if (!channelName) {
            return createBadRequestResponse(res, err.ErrNoChannelNameGiven);
        }

        const newChannel = await insertAdminChannel(channelId, channelName);
        if (!newChannel) {
            return createInternalServerResponse(res, err.ErrInternalServer);
        }

        createCreatedResponse(res, newChannel);
    } catch(error) {
        createInternalServerResponse(res, error);
    }
}

async function getAdminChannelIdByName(req, res) {
    try {
        const { channelName } = req.body;
        if (!channelName) {
            return createBadRequestResponse(res, err.ErrNoChannelNameGiven);
        }

        const channelId = await selectChannelIdByName(channelName);

        if (channelId.info === 'Conflict') {
            return createNotFoundResponse(res, err.ErrNoChannelFound);
        }

        createOKResponse(res, channelId);
    } catch(error) {
        createInternalServerResponse(res, error);
    }
}

async function patchChannelIdByName(req, res) {
    try {
        const { channelName, channelId } = req.body;
        if (!channelName) {
            return createBadRequestResponse(res, err.ErrNoChannelNameGiven);
        }

        const updatedChannelId = await updateChannelIdByName(channelName, channelId);
        if (!updatedChannelId) {
            return createNotFoundResponse(res, err.ErrNoChannelFound);
        }

        createOKResponse(res, updatedChannelId);
    } catch(error) {
        createInternalServerResponse(res, error);
    }
}

module.exports = { createAdminChannel, getAdminChannelIdByName, patchChannelIdByName };