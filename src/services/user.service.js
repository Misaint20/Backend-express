const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const USERS_FILE = path.join(__dirname, '..', '..', 'data', 'users.json');

const readUsers = () => {
    try {
        return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
    } catch (err) {
        return [];
    }
};

const writeUsers = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

class UserService {
    static async getAllUsers() {
        return readUsers();
    }

    static async getUserById(id) {
        const users = readUsers();
        return users.find(u => u.id === id);
    }

    static async findUserByEmail(email) {
        const users = readUsers();
        return users.find(u => u.email === email);
    }

    static async createUser(userData) {
        const users = readUsers();
        const newUser = {
            id: users.length + 1,
            ...userData
        };
        users.push(newUser);
        writeUsers(users);
        return newUser;
    }

    static async updateUser(id, userData) {
        const users = readUsers();
        const index = users.findIndex(u => u.id === id);
        if (index === -1) return null;

        if (userData.password) {
            const salt = bcrypt.genSaltSync(10);
            userData.password = bcrypt.hashSync(userData.password, salt);
        }

        users[index] = { ...users[index], ...userData };
        writeUsers(users);
        return users[index];
    }

    static async deleteUser(id) {
        const users = readUsers();
        const newUsers = users.filter(u => u.id !== id);
        if (users.length === newUsers.length) return false;
        writeUsers(newUsers);
        return true;
    }
}

module.exports = UserService;