const express = require('express');
const router = express.Router();
const authRoutes = require('./v1/auth.routes');
const userRoutes = require('./v1/user.routes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

module.exports = router;