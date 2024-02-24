const express = require('express');
const router = express.Router();
const postsController = require('../controllers/post.controller');
const authMiddleware = require('../middlewares/auth.middleware')

// GET request to retrieve all posts
router.get('/', authMiddleware.verifyToken, postsController.getAllPosts);

// GET request to retrieve all posts by a specific user
router.get('/user/:userId', authMiddleware.verifyToken, postsController.getPostsByUser);

// POST request to create a new post
router.post('/', authMiddleware.verifyToken, postsController.createPost);

// PUT request to update a specific post
router.put('/:id', authMiddleware.verifyToken, postsController.updatePost);

// DELETE request to delete a specific post
router.delete('/:id', authMiddleware.verifyToken, postsController.deletePost);

module.exports = router;