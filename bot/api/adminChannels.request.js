import { request } from "./api.js";

const API_BASE_URL = process.env.API_URL;
const ADMIN_CHANNEL_URL = '/discord-admin-channels';

export const createAdminChannelRequest = async (channelId, channelName) => {
    await request('post', API_BASE_URL + ADMIN_CHANNEL_URL, {channelId, channelName})
        .then(data => { return data });
}

export const getAdminChannelIdRequest = async (channelName) => {
    await request('get', `${API_BASE_URL}${ADMIN_CHANNEL_URL}/${channelName}`)
        .then(data => { return data });
}

export const patchAdminChannelRequest = async (channelName, channelId) => {
    await request('patch', API_BASE_URL + ADMIN_CHANNEL_URL, { channelName, channelId })
        .then(data => { return data });
}