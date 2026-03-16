const request = require('supertest');
const app = require('../server');
const { describe } = require('node:test');

describe('GET /stocks', () => {
    it('should return all stocks', async () => {
        const res = await request(app).get('/stocks');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});