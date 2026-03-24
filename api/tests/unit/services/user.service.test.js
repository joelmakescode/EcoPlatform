jest.mock('../../../src/config/database', () => ({
    execute: jest.fn()
}));

const pool = require('../../../src/config/database');
const { insertUser, selectUserBalance, updateUserBalance } = require('../../../src/services/user.service');

describe("insertUser", () => {
    it("should insert user with discord id", async () => {
        pool.execute.mockResolvedValue([{ insertId: 1, info: "OK" }]);

        const result = await insertUser("123", null);

        expect(result).toEqual({
            id: 1,
            info: "OK",
            discordId: "123"
        });
    });
});

describe("selectUserBalance", () => {
    it('should return user balance', async () => {
        pool.execute.mockResolvedValue([ [ { balance: 0 } ], [] ]);

        const result = await selectUserBalance("123", null);

        expect(result).toEqual({
            balance: 0
        })
    });
});

describe("updateUserBalance", () => {
    it('should update user balance', async () => {
        pool.execute.mockResolvedValue([ { affectedRows: 1, info: 'OK' }, [] ]);

        const result = await updateUserBalance("123", null, 10);

        expect(result).toEqual({
            info: 'OK',
            discordId: '123',
            sum: 10
        });
    });
});