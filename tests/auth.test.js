const request = require('supertest');
const app = require('../src/server');
const { usersUtil } = require('../src/config/app.config');
const fs = require('fs');

describe('Auth API', () => {
    let server;

    beforeAll(async () => {
        server = app.listen(4001);
        
        // Limpiar archivo de test si existe
        try {
            fs.unlinkSync(usersUtil.USERS_FILE);
        } catch (err) {
            // Ignorar si el archivo no existe
        }
    });

    afterAll(async () => {
        // Limpiar archivo de test
        try {
            fs.unlinkSync(usersUtil.USERS_FILE);
        } catch (err) {
            // Ignorar si el archivo no existe
        }
        
        await new Promise(resolve => server.close(resolve));
    });

    describe('POST /auth/register', () => {
        it('should register a new user', async () => {
            const response = await request(server)
                .post('/api/v1/auth/register')
                .send({
                    name: 'New User',
                    email: 'newuser@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user).toHaveProperty('email', 'newuser@example.com');
            expect(response.body.user).not.toHaveProperty('password');
        });
    });

    describe('POST /auth/login', () => {
        it('should login an existing user', async () => {
            await request(server)
                .post('/api/v1/auth/register')
                .send({
                    name: 'Login User',
                    email: 'loginuser@example.com',
                    password: 'password123'
                });

            const response = await request(server)
                .post('/api/v1/auth/login')
                .send({
                    email: 'loginuser@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user).toHaveProperty('email', 'loginuser@example.com');
            expect(response.body.user).not.toHaveProperty('password');
        });
    });
}); 