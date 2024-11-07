const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiration } = require('../config/auth.config');
const UserService = require('./user.service');

class AuthService {
    static async register(userData) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);

            const newUser = await UserService.createUser({
                ...userData,
                password: hashedPassword
            });

            const token = jwt.sign({ id: newUser.id }, jwtSecret, { expiresIn: jwtExpiration });
            
            return {
                token,
                user: newUser
            };
        } catch (error) {
            throw new Error(error.message || 'Error during registration');
        }
    }

    static async login(credentials) {
        try {
            const user = await UserService.findUserByEmail(credentials.email);
            if (!user) {
                throw new Error('Invalid credentials');
            }

            const isValidPassword = await bcrypt.compare(credentials.password, user.password);
            if (!isValidPassword) {
                throw new Error('Invalid credentials');
            }

            const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: jwtExpiration });
            
            const { password, ...userWithoutPassword } = user;
            return {
                token,
                user: userWithoutPassword
            };
        } catch (error) {
            throw new Error(error.message || 'Error during login');
        }
    }
}

module.exports = AuthService;