const { logger } = require('../utils/logger');

// Middleware para manejar errores
const errorHandler = (err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
};

module.exports = errorHandler;