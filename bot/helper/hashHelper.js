import bcrypt from 'bcrypt';

/**
 * Hashes the password the user has entered.
 * 
 * @param {string} input 
 * @returns {string}
 */
export async function hashPassword(input) {
    return await bcrypt.hash(input, 12);
}

/**
 * Compares an input password to a stored hash.
 * 
 * @param {string} inputPassword 
 * @param {string} storedHash 
 * @returns {boolean}
 */
export async function verifyPassword(inputPassword, storedHash) {
    return await bcrypt.compare(inputPassword, storedHash);
}