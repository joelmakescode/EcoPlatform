import en from '../json/languages/en.json' with { type: "json" };
import de from '../json/languages/de.json' with { type: "json" };
import { getUserLanguage } from '../api/apiClient.js';

const languages = { en, de }

/**
 * Translates a given key into a valid response string.
 * 
 * @param {string} userId 
 * @param {string} key 
 * @returns {string}
 */
export function translate(userId, key) {
    const language = whatLanguage(userId);
    const langFile = languages[language] ?? languages.en;

    const value = key
        .split('.')
        .reduce((obj, k) => obj?.[k], langFile);

    return value ?? key;
}


export async function whatLanguage(userId) {
    const userData = await getUserLanguage(userId);
    if (!userData) return 'en';

    return userData.language;
}
