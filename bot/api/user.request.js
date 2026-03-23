import { request } from "./api.js";

const API_BASE_URL = process.env.API_URL;
const USERS_URL = '/users';
const BALANCE_URL = '/balance';

export const createNewUserRequest = async (discordId) => {
    return await request('post', API_BASE_URL + USERS_URL, { discordId });
}

export const getUserBalanceRequest = async (discordId) => {
    return await request('get', `${API_BASE_URL}${USERS_URL}${BALANCE_URL}?discordId=${discordId}`);
}

export const patchUserBalanceRequest = async (discordId, sum) => {
    return await request('patch', `${API_BASE_URL}${USERS_URL}${BALANCE_URL}`, { discordId, sum });
}