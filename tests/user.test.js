const request = require('supertest');
const app = require('../src/server');
const { usersUtil } = require('../src/config/app.config');

describe('User API', () => {
    let server;
    let testUser;

    beforeAll(() => {
        server = app.listen(4001);
        
        // Crear usuario de prueba
        testUser = {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            password: '$2a$10$testHashedPassword'
        };
        
        // Guardar usuario de prueba
        usersUtil.writeUsers([testUser]);
    });

    afterAll((done) => {
        // Limpiar usuarios de prueba
        usersUtil.writeUsers([]);
        server.close(done);
    });

    it('should get all users', async () => {
        const response = await request(server)
            .get('/api/v1/users');

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(1);
    });

    it('should get a user by ID', async () => {
        const response = await request(server)
            .get('/api/v1/users/1');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', 1);
        expect(response.body).toHaveProperty('name', 'Test User');
        expect(response.body).toHaveProperty('email', 'test@example.com');
    });

    it('should update a user', async () => {
        const response = await request(server)
            .put('/api/v1/users/1')
            .send({
                name: 'Jane Doe',
                email: 'janedoe@example.com',
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', 1);
        expect(response.body).toHaveProperty('name', 'Jane Doe');
        expect(response.body).toHaveProperty('email', 'janedoe@example.com');
    });

    it('should delete a user', async () => {
        const response = await request(server)
            .delete('/api/v1/users/1');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'User deleted successfully');
        
        // Verificar que el usuario fue eliminado
        const users = usersUtil.readUsers();
        expect(users.length).toBe(0);
    });
});