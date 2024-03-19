const Post = require('../models/post/post');

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ created: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching posts", error: error.message || error });
    }
};

exports.getPostsByUser = async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.params.userId }).sort({ created: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user's posts", error: error.message || error });
    }
};

exports.createPost = async (req, res) => {
    try {
        const body = JSON.parse(req.body.jsonData);
        const post = new Post({
            userId: req.user.userId,
            title: body.title,
            description: body.description,
            image: req.file.path,
            created: new Date(),
        });
        const newPost = await post.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(400).json({ message: "Error creating post", error: error.message || error });
    }
};

exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const updatedData = { title, description };

    if (req.file) {
        updatedData.image = req.file.path;
    }

    try {
        const post = await Post.findById(id);
        if (post.userId.toString() !== req.user.userId) {
            return res.status(401).json({ message: "Not authorized to update this post" });
        }

        const updatedPost = await Post.findByIdAndUpdate(id, updatedData, { new: true });
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(400).json({ message: "Error updating post", error: error.message || error });
    }
};

exports.deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.userId.toString() !== req.user.userId) {
            return res.status(401).json({ message: "Not authorized to delete this post" });
        }

        await post.remove();
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting post", error: error.message || error });
    }
};