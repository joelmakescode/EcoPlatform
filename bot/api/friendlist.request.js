import { request } from "./api.js";

const API_BASE_URL = process.env.API_URL;
const FRIENDLIST_URL = '/friendlist';

export const createFriendRequest = async (discordId, discordFriendId) => {
    await request('post', API_BASE_URL + FRIENDLIST_URL, { discordId, discordFriendId })
        .then(() => {});
}

export const getFriendlistRequest = async (discordId) => {
    await request('get', `${API_BASE_URL}${FRIENDLIST_URL}/${discordId}`)
        .then(data => { return data });
}

export const deleteFriendRequest = async (discordId, discordFriendId) => {
    await request('delete', API_BASE_URL + FRIENDLIST_URL, { discordId, discordFriendId })
        .then(() => {});
}