jest.mock('../../../src/config/database', () => ({
    execute: jest.fn()
}));

const pool = require('../../../src/config/database');
const { selectUserByDiscordId, insertDiscordUser, updateAutofill, updateLanguage, updatePasswordHash } = require('../../../src/services/discordUser.service');

describe("selectUserByDiscordId", () => {
    it('should select a user by discord Id', async () => {
        pool.execute.mockResolvedValue([ [ { id: 1, discord_id: 123, password_hash: "", language: 'en', autofill: 0 } ], [] ])

        const result = await selectUserByDiscordId("123");

        expect(result).toEqual({
            id: 1,
            discord_id: 123,
            password_hash: "",
            language: "en",
            autofill: 0
        });
    });
});

describe("insertDiscordUser", () => {
    it('should insert a discord user', async () => {
        pool.execute.mockResolvedValue([{ affectedRows: 1, info: 'OK' }]);

        const result = await insertDiscordUser(123, "");

        expect(result).toEqual({
            info: 'OK',
            discordId: 123
        });
    });
});

describe("updateAutofill", () => {
    it('should update discord user autofill', async () => {
        pool.execute.mockResolvedValue([{ affectedRows: 1, info: 'OK' }]);

        const result = await updateAutofill(123, 1);

        expect(result).toEqual({
           info: 'OK',
           discordId: 123,
           autofill: 1
        });
    });
});

describe('updateLanguage', () => {
    it('should update discord user language', async () => {
        pool.execute.mockResolvedValue([{ affectedRows: 1, info: 'OK' }]);

        const result = await updateLanguage(123, 'de');

        expect(result).toEqual({
            info: 'OK',
            discordId: 123,
            language: 'de'
        });
    });
});

describe('updatePasswordHash', () => {
    it('should update discord user password hash', async () => {
        pool.execute.mockResolvedValue([ { affectedRows: 1, info: 'OK' } ]);

        const result = await updatePasswordHash(123, "testpw");

        expect(result).toEqual({
           info: 'OK',
           discordId: 123
        });
    });
});
