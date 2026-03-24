jest.mock('../../../src/services/user.service', () => ({
    insertUser: jest.fn(),
    selectUserBalance: jest.fn(),
    updateUserBalance: jest.fn()
})) ;

const request = require('supertest');
const app = require('../../../src/app');
const userService = require('../../../src/services/user.service');

describe('POST /users', () => {
    it('should create a user', async () => {
        userService.insertUser.mockResolvedValue({
            id: 1,
            discordId: 123
        });

        const res = await request(app)
            .post("/api/users")
            .send({ discordId: 123, });

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(
            {
                data: {
                    discordId: 123,
                    id: 1
                }
            }
        )
    });

    it('should return 400 if body is missing', async () => {
        const res = await request(app).post('/api/users').send({});
        expect(res.statusCode).toBe(400);
    });
});

describe('/GET user balance', () => {
    it('should return user balance', async () => {
        userService.selectUserBalance.mockResolvedValue({ discordId: 123, balance: 500 });
        const res = await request(app)
            .get('/api/users/balance')
            .query({ discordId: 123 })

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
            { data: {
                    discordId: 123,
                    balance: 500
                }
            }
        );
    });

    it('should return 400 if discordId or username is missing', async () => {
        userService.selectUserBalance.mockResolvedValue(null);
        const res = await request(app)
            .get('/api/users/balance')
            .query({});

        expect(res.statusCode).toBe(400);
    });

    it('should return 404 if discordId or username doesnt exist', async () => {
        userService.selectUserBalance.mockResolvedValue(null);
       const res = await request(app)
           .get('/api/users/balance')
           .query({ discordId: 123, username: 'test' });

       expect(res.statusCode).toBe(404);
    });
});

describe('/PATCH user balance', () => {
    it('should add to user balance', async () => {
        userService.updateUserBalance.mockResolvedValue({ discordId: 123, sum: 10 });
        const res = await request(app)
            .patch('/api/users/balance')
            .send({ discordId: 123, sum: 10 });

        expect(res.statusCode).toBe(200);
    });

    it('should return 400 if discordId or username or sum is missing', async () => {
        userService.updateUserBalance.mockResolvedValue(null);
        const res = await request(app)
            .patch('/api/users/balance')
            .send({})

        expect(res.statusCode).toBe(400);
    });

    it('should return 404 if discord User or c++ user doesnt exist', async () => {
        userService.updateUserBalance.mockResolvedValue(null);
        const res = await request(app)
            .patch('/api/users/balance')
            .send({ discordId: 123, username: 'test', sum: 10 });

        expect(res.statusCode).toBe(404);
    });
});