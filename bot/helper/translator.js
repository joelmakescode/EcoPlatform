import en from '../json/languages/en.json' with { type: "json" };
import de from '../json/languages/de.json' with { type: "json" };
import {getDiscordUserRequest} from "../api/discordUser.request.js";

const languages = { en, de }

const userLanguageCache = new Map();

/**
 * Translates a given key into a valid response string.
 * 
 * @param {string} userId 
 * @param {string} key 
 * @returns {string}
 */
export function translate(userId, key) {
    const language = userLanguageCache.get(userId) ?? 'en';
    const langFile = languages[language] ?? languages.en;

    const value = key
        .split('.')
        .reduce((obj, k) => obj?.[k], langFile);

    return value ?? key;
}

export async function fetchAndCacheLanguage(userId) {
    const userData = await getDiscordUserRequest(userId);

    const language = userData?.data?.language ?? 'en';
    userLanguageCache.set(userId, language);

    return language;
}

export async function whatLanguage(userId) {
    const userData = await getDiscordUserRequest(userId);
    if (!userData) return 'en';

    return userData.data.language;
}
