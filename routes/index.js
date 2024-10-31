const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const userRoutes = require('./users');

// Configurar rutas
router.use('/', authRoutes);
router.use('/users', userRoutes);

module.exports = router;