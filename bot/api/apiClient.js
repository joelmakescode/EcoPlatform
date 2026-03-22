import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 🔹 Generic request wrapper (optional logging + error handling)
async function request(method, url, data = null) {
    try {
        const res = await api({ method, url, data });
        return res.data;
    } catch (error) {
        console.error(`API Error [${method.toUpperCase()} ${url}]:`, error.response?.data || error.message);
        throw error;
    }
}

/* =========================
   Guild Logs
========================= */

export const getGuildLogChannel = (guildId) =>
    request('get', `/guilds-log/${guildId}`);

export const addOrUpdateGuildLogChannel = (guildId, logChannelId) =>
    request('post', `/guilds-log/${guildId}`, { logChannelId });

export const removeGuildLogChannel = (guildId) =>
    request('delete', `/guilds-log/${guildId}`);

/* =========================
   Reports
========================= */

export const insertNewReport = (messageId, reporterId) =>
    request('post', '/reports', { messageId, reporterId });

export const selectMessageData = (messageId) =>
    request('get', `/reports/${messageId}`);

export const setReportToFinished = (messageId) =>
    request('put', '/reports/finish', { messageId });

/* =========================
   User Bank Accounts
========================= */

export const insertUserIntoBankAccountTable = (userId) =>
    request('post', '/user-bank-accounts', { userId });

export const selectUserBalanceAccountTable = async (userId) => {
    const data = await request('get', `/user-bank-accounts/${userId}/balance`);
    return data.balance;
};

export const updateUserInBankAccountTable = (userId, amount) =>
    request('put', '/user-bank-accounts/add-balance', { userId, amount });

/* =========================
   Users
========================= */

export const createUserInAPI = (username, discordId, password) =>
    request('post', '/users', { username, discord_id: discordId, password });

export const updateUserPasswordInAPI = (userId, newPassword) =>
    request('put', '/users/change-password', { userId, newPassword });

export const getUserFromAPI = (discordId) =>
    request('get', `/users/${discordId}`);

export const getUserLanguage = async (userId) => {
    const data = await request('get', `/users/${userId}/language`);
    return data.language;
};

export const getUserAutofill = async (userId) => {
    const data = await request('get', `/users/${userId}/autofill`);
    return data.autofill;
}

export const setUserLanguage = (userId, language) =>
    request('put', `/users/${userId}/language`, { language });

export const updateUserAutoFill = (userId, autofill) =>
    request('put', `/users/${userId}/autofill`, { autofill });