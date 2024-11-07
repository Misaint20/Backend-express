const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/auth.config');

// Middleware para verificar el token de autenticación
const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), jwtSecret);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
};

module.exports = {
    verifyToken
};