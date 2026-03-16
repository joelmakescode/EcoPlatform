import en from '../json/languages/en.json' with { type: "json" };
import de from '../json/languages/de.json' with { type: "json" };
import { database } from '../databasequeries/database.js';

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


export function whatLanguage(userId) {
    const userData = database.prepare('SELECT language FROM users WHERE id = ?').get(userId);
    if (!userData) return 'en';

    return userData.language;
}
