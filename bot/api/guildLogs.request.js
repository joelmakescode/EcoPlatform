import { request } from "./api.js";

const API_BASE_URL = process.env.API_URL;
const GUILD_LOGS_URL = '/guild-logs';

export const createNewGuildLogRequest = async (guildId, channelId) => {
    await request('post', API_BASE_URL + GUILD_LOGS_URL, { guildId, channelId });
}

export const getGuildLogRequest = async (guildId) => {
    return await request('get', `${API_BASE_URL}${GUILD_LOGS_URL}/${guildId}`);
}

export const patchGuildLogRequest = async (guildId, channelId) => {
    await request('patch', API_BASE_URL + GUILD_LOGS_URL, { guildId, channelId });
}