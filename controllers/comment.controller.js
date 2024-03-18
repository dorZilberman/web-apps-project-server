const Comment = require('../models/comment/comment');

exports.getAllCommentsByPost = async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId }).sort({ created: -1 });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching comments by post", error });
    }
};

exports.createComment = async (req, res) => {
    const comment = new Comment({
        userId: req.user.id,
        postId: req.body.postId,
        content: req.body.content,
        created: new Date(),
    });

    try {
        const newComment = await comment.save();
        res.status(201).json(newComment);
    } catch (error) {
        res.status(400).json({ message: "Error creating comment", error });
    }
};

exports.deleteComment = async (req, res) => {
    const { id } = req.params;

    try {
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized to delete this Comment" });
        }

        await comment.remove();
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting Comment", error });
    }
};