const request = require('supertest');
const app = require('../src/server');

describe('Auth API', () => {
    let server;

    beforeAll(() => {
        server = app.listen(4000);
    });

    afterAll((done) => {
        server.close(done);
    });

    it('should register a new user', async () => {
        const response = await request(server)
            .post('/api/v1/auth/register')
            .send({
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('user');
    });

    it('should login an existing user', async () => {
        const response = await request(server)
            .post('/api/v1/auth/login')
            .send({
                email: 'johndoe@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('user');
    });
});