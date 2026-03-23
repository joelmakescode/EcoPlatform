import { request } from "./api.js";

const API_BASE_URL = process.env.API_URL;
const CODES_URL = '/discord-codes';

export const createNewCodeRequest = async (discordId) => {
    return await request('post', API_BASE_URL + CODES_URL, { discordId });
}

export const getCodeRequest = async (code) => {
    return await request('get', `${API_BASE_URL}${CODES_URL}/${code}`);
}

export const deleteCodeRequest = async (code) => {
    await request('delete', API_BASE_URL + CODES_URL, { code });
}