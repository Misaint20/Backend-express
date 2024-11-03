const { validationResult } = require('express-validator');
const AuthService = require('../services/auth.service');
const { logger } = require('../utils/logger');

class AuthController {
    static async register(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const result = await AuthService.register(req.body);
            return res.status(201).json(result);
        } catch (error) {
            logger.error('Error in register:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async login(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const result = await AuthService.login(req.body);
            return res.status(200).json(result);
        } catch (error) {
            logger.error('Error in login:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = AuthController;