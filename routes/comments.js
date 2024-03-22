const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/comment.controller');
const authMiddleware = require('../middlewares/auth.middleware')

/**
 * @swagger
 * /comments/{postId}:
 *   get:
 *     summary: Retrieve all comments for a specific post
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: A list of comments of the post.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comments'
 *       401:
 *         description: Unauthorized
 */
router.get('/:postId', authMiddleware.verifyToken, commentsController.getAllCommentsByPost);

/**
 * @swagger
 * /comments:
 *   put:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', authMiddleware.verifyToken, commentsController.createComment);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a specific comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 */
router.delete('/:id', authMiddleware.verifyToken, commentsController.deleteComment);

module.exports = router;