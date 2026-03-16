/**
 * Checks if a userId is a valid snowflake (for database purposes).
 * 
 * @param {number} userId 
 * @returns {boolean}
 */
export function isValidSnowflake(userId) {
    try {
        const num = BigInt(userId);
        return num >= 0n && num <= 18446744073709551615n;
    } catch {
        return false;
    }
}