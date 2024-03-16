const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/comment.controller');
const authMiddleware = require('../middlewares/auth.middleware')

// GET request to retrieve all comments by post
router.get('/:postId', authMiddleware.verifyToken, commentsController.getAllCommentsByPost);

// POST request to create a new comment
router.post('/', authMiddleware.verifyToken, commentsController.createComment);

// DELETE request to delete a specific comment
router.delete('/:id', authMiddleware.verifyToken, commentsController.deleteComment);

module.exports = router;