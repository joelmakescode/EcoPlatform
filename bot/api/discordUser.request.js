import { request } from "./api.js";

const API_BASE_URL = process.env.API_URL;
const DISCORD_USERS_URL = '/discord-users';

export const createDiscordUserRequest = async (discordId, passwordHash) => {
    await request('post', API_BASE_URL + DISCORD_USERS_URL, { discordId, passwordHash });
}

export const getDiscordUserRequest = async (discordId) => {
    return await request('get', `${API_BASE_URL}${DISCORD_USERS_URL}/${discordId}`);
}

export const patchDiscordUserAutofill = async (discordId, autofill) => {
    return await request('patch', `${API_BASE_URL}${DISCORD_USERS_URL}/autofill`, { discordId, autofill });
}

export const patchDiscordUserLanguage = async (discordId, language) => {
    return await request('patch', `${API_BASE_URL}${DISCORD_USERS_URL}/language`, { discordId, language });
}

export const patchDiscordUserPassword = async (discordId, passwordHash) => {
    return await request('patch', `${API_BASE_URL}${DISCORD_USERS_URL}/password`, { discordId, passwordHash });
}