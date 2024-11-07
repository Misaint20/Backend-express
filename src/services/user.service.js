const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { usersUtil } = require('../config/app.config');

class UserService {
    static async getAllUsers() {
        return usersUtil.readUsers();
    }

    static async getUserById(id) {
        const users = await this.getAllUsers();
        return users.find(u => u.id === parseInt(id));
    }

    static async findUserByEmail(email) {
        const users = await this.getAllUsers();
        return users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    static async getNextId() {
        const users = await this.getAllUsers();
        return users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    }

    static async createUser(userData) {
        const users = await this.getAllUsers();
        
        // Verificar si el email ya existe
        const existingUser = await this.findUserByEmail(userData.email);
        if (existingUser) {
            throw new Error('Email already exists');
        }

        const newUser = {
            id: await this.getNextId(),
            ...userData,
            email: userData.email.toLowerCase(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        users.push(newUser);
        usersUtil.writeUsers(users);
        
        // Retornar usuario sin password
        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }

    static async updateUser(id, userData) {
        const users = await this.getAllUsers();
        const index = users.findIndex(u => u.id === parseInt(id));
        if (index === -1) return null;

        // Si se actualiza el email, verificar que no exista
        if (userData.email) {
            const existingUser = await this.findUserByEmail(userData.email);
            if (existingUser && existingUser.id !== parseInt(id)) {
                throw new Error('Email already exists');
            }
            userData.email = userData.email.toLowerCase();
        }

        if (userData.password) {
            const salt = await bcrypt.genSalt(10);
            userData.password = await bcrypt.hash(userData.password, salt);
        }

        users[index] = {
            ...users[index],
            ...userData,
            updatedAt: new Date().toISOString()
        };

        usersUtil.writeUsers(users);
        
        // Retornar usuario sin password
        const { password, ...userWithoutPassword } = users[index];
        return userWithoutPassword;
    }

    static async deleteUser(id) {
        const users = await this.getAllUsers();
        const filteredUsers = users.filter(u => u.id !== parseInt(id));
        
        if (users.length === filteredUsers.length) {
            return false;
        }
        
        usersUtil.writeUsers(filteredUsers);
        return true;
    }
}

module.exports = UserService;