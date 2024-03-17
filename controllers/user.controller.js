const User = require('../models/user/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET_TOKEN;

exports.registerUser = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            email,
            password: hashedPassword,
            fullName: name
        });

        const savedUser = await newUser.save();
        const token = jwt.sign(
            { email: savedUser.email, userId: savedUser._id },
            jwtSecret,
            { expiresIn: '1h' }
        );
        res.status(201).json({
            message: 'User created!',
            token: token
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering new user', error: error });
    }
};

exports.registerUserWithGoogle = async (req, res) => {
    try {
        const { email, name } = req.body;

        const newUser = new User({
            email,
            password: 'google-auth',
            fullName: name
        });

        const savedUser = await newUser.save();
        const token = jwt.sign(
            { email: savedUser.email, userId: savedUser._id },
            jwtSecret,
            { expiresIn: '1h' }
        );
        res.status(201).json({
            message: 'User created!',
            token: token
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering new user', error: error });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Authentication failed: user not found.' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Authentication failed: incorrect password.' });
        }

        const token = jwt.sign(
            { email: user.email, userId: user._id },
            jwtSecret,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: user._id
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({
            email: user.email,
            fullName: user.fullName,
            created: user.created
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile', error: error });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const { fullName } = req.body;
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        user.fullName = fullName;
        const updatedUser = await user.save();

        res.status(200).json({
            message: 'User profile updated',
            fullName: updatedUser.fullName
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user profile', error: error });
    }
};

exports.deleteUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        await User.findByIdAndRemove(req.params.userId);

        res.status(200).json({ message: 'User profile deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user profile', error: error });
    }
};