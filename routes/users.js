const express = require('express');
const router = express.Router();
const usersController = require('../controllers/user.controller');
const refreshTokenController = require('../controllers/refresh-token.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const googleAuthMiddleware = require('../middlewares/google-auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users management
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/register', usersController.registerUser);

/**
 * @swagger
 * /users/googleRegister:
 *   post:
 *     summary: Register a new user via Google authentication
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Google user token
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/googleRegister', googleAuthMiddleware.verifyToken, usersController.registerUserWithGoogle);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login an existing user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Authentication failed
 */
router.post('/login', usersController.loginUser);

/**
 * @swagger
 * /users/googleLogin:
 *   post:
 *     summary: Login a user via Google authentication
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Google user token
 *     responses:
 *       201:
 *         description: User Logged In successfully with Google!
 *       400:
 *         description: Bad request
 */
router.post('/googleLogin', googleAuthMiddleware.verifyToken, usersController.loginUserWithGoogle);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       400:
 *         description: Bad request
 */
router.put('/profile', authMiddleware.verifyToken, usersController.updateUserProfile);

/**
 * @swagger
 * /users/profile:
 *   delete:
 *     summary: Delete user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/profile', authMiddleware.verifyToken, usersController.deleteUserProfile);

/**
 * @swagger
 * /users/refreshToken:
 *   get:
 *     summary: get new tokens for user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User got new tokens
 *       403:
 *         description: User not found
 */
router.get('/refreshToken', refreshTokenController.refreshToken);

module.exports = router;