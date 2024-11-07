const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/user.controller');
const { verifyToken } = require('../../middleware/auth.middleware');

router.get('/', verifyToken, UserController.getAllUsers);
router.get('/:id', verifyToken, UserController.getUserById);
router.put('/:id', verifyToken, UserController.updateUser);
router.delete('/:id', verifyToken, UserController.deleteUser);

module.exports = router;