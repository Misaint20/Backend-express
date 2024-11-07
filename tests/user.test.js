const request = require('supertest');
const app = require('../src/server');
const { usersUtil } = require('../src/config/app.config');
const fs = require('fs');
const path = require('path');

describe('User API', () => {
    let server;
    let authToken;
    let testUserId;

    beforeAll(async () => {
        server = app.listen(4001);
        
        // Limpiar archivo de test si existe
        try {
            fs.unlinkSync(usersUtil.USERS_FILE);
        } catch (err) {
            // Ignorar si el archivo no existe
        }

        // Registrar un usuario de prueba
        const response = await request(server)
            .post('/api/v1/auth/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });

        authToken = response.body.token;
        testUserId = response.body.user.id;
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

    describe('GET /users', () => {
        it('should get all users', async () => {
            const response = await request(server)
                .get('/api/v1/users')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0]).not.toHaveProperty('password');
        });
    });

    describe('GET /users/:id', () => {
        it('should get user by ID', async () => {
            const response = await request(server)
                .get(`/api/v1/users/${testUserId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', testUserId);
            expect(response.body).toHaveProperty('email', 'test@example.com');
            expect(response.body).not.toHaveProperty('password');
        });
    });

    describe('PUT /users/:id', () => {
        it('should update user', async () => {
            const response = await request(server)
                .put(`/api/v1/users/${testUserId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: 'Updated Name',
                    email: 'updated@example.com'
                });

            expect(response. status).toBe(200);
            expect(response.body).toHaveProperty('id', testUserId);
            expect(response.body).toHaveProperty('email', 'updated@example.com');
            expect(response.body).not.toHaveProperty('password');
        });
    });

    describe('DELETE /users/:id', () => {
        it('should delete user', async () => {
            const response = await request(server)
                .delete(`/api/v1/users/${testUserId}`)
                .set('Authorization', `Bearer ${authToken}`);
    
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'User deleted successfully' });
        });
    });
});