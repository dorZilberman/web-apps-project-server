const express = require('express');
const router = express.Router();
const usersController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const googleAuthMiddleware = require('../middlewares/google-auth.middleware');

// POST request to register a new user
router.post('/register', usersController.registerUser);

// POST request to register a new google user
router.post('/googleRegister', googleAuthMiddleware.verifyToken, usersController.registerUserWithGoogle);

// POST request for user login
router.post('/login', usersController.loginUser);

// GET request for the current user's profile
router.get('/profile', authMiddleware.verifyToken, usersController.getUserProfile);

// PUT request to update a user's profile
router.put('/profile', authMiddleware.verifyToken, usersController.updateUserProfile);

// DELETE request to delete a user's profile
router.delete('/profile', authMiddleware.verifyToken, usersController.deleteUserProfile);

module.exports = router;