const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/get-users', verifyToken, userController.getUsers);
router.put('/update-user/:id', verifyToken, userController.updateUser);
router.delete('/delete-user/:id', verifyToken, userController.deleteUser);

module.exports = router;