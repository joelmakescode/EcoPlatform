import { request } from "./api.js";

const API_BASE_URL = process.env.API_URL;
const DISCORD_USERS_URL = '/discord-users';

export const createDiscordUserRequest = async (discordId, password) => {
    await request('post', API_BASE_URL + DISCORD_USERS_URL, { discordId, password });
}

export const postLoginDiscordUserRequest = async (discordId, password) => {
    return await request('post', API_BASE_URL + DISCORD_USERS_URL + "/login", { discordId, password });
}

export const getDiscordUserRequest = async (discordId) => {
    return await request('get', `${API_BASE_URL}${DISCORD_USERS_URL}/${discordId}`);
}

export const putDiscordUserAutofill = async (discordId) => {
    return await request('patch', `${API_BASE_URL}${DISCORD_USERS_URL}/autofill/${discordId}`);
}

export const putDiscordUserLanguage = async (discordId, language) => {
    return await request('patch', `${API_BASE_URL}${DISCORD_USERS_URL}/language/${discordId}`, { language });
}

export const putDiscordUserPassword = async (discordId, password) => {
    return await request('patch', `${API_BASE_URL}${DISCORD_USERS_URL}/password/${discordId}`, { password });
}
