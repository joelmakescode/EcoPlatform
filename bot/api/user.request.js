import { request } from "./api.js";

const API_BASE_URL = process.env.API_URL;
const USERS_URL = '/users';

export const getUserBalanceRequest = async (discordId) => {
    await request("get", `${API_BASE_URL}${USERS_URL}/balance/${discordId}`);
}

export const putUserBalanceRequest = async (accountId, balance) => {
    await request("put", `${API_BASE_URL}${USERS_URL}/balance/${accountId}`, { balance });
}