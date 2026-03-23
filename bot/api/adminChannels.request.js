import { request } from "./api.js";

const API_BASE_URL = process.env.API_URL;
const ADMIN_CHANNEL_URL = '/discord-admin-channels';

export const createAdminChannelRequest = async (channelId, channelName) => {
    return await request('post', API_BASE_URL + ADMIN_CHANNEL_URL, {channelId, channelName});
}

export const getAdminChannelIdRequest = async (channelName) => {
    return await request('get', `${API_BASE_URL}${ADMIN_CHANNEL_URL}/${channelName}`);
}

export const patchAdminChannelRequest = async (channelName, channelId) => {
    return await request('patch', API_BASE_URL + ADMIN_CHANNEL_URL, { channelName, channelId });
}