const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiration } = require('../config/auth.config');
const UserService = require('./user.service');

class AuthService {
    static async register(userData) {
        const existingUser = await UserService.findUserByEmail(userData.email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        const newUser = await UserService.createUser({ ...userData, password: hashedPassword });
        const token = jwt.sign({ id: newUser.id }, jwtSecret, { expiresIn: jwtExpiration });
        return { token, user: newUser };
    }

    static async login(userData) {
        const user = await UserService.findUserByEmail(userData.email);
        if (!user) {
            throw new Error('User not found');
        }

        const isMatch = await bcrypt.compare(userData.password, user.password);
        if (!isMatch) {
            throw new Error('Invalid password');
        }

        const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: jwtExpiration });
        return { token, user };
    }
}

module.exports = AuthService;