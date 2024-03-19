const User = require('../models/user/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET_TOKEN;
const jwtRefreshTokenSecret = process.env.JWT_SECRET_REFRESH_TOKEN;

exports.registerUser = async (req, res) => {
    try {
        const { email, password, name } = JSON.parse(req.body.jsonData);
        if (!email || !password || !name) throw 'missing parameters';
        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            email,
            password: hashedPassword,
            fullName: name,
            image: req.file.path,
        });

        const savedUser = await newUser.save();
        const accessToken = jwt.sign(
            { email: savedUser.email, userId: savedUser._id },
            jwtSecret,
            { expiresIn: '1h' }
        );
        const refreshToken = jwt.sign(
            { userId: savedUser._id },
            jwtRefreshTokenSecret,
        );
        res.status(201).json({
            message: 'User created!',
            userId: savedUser._id,
            accessToken,
            refreshToken
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering new user', error: error.message || error });
    }
};

exports.registerUserWithGoogle = async (req, res) => {
    try {
        const { email, name, picture } = req.body;
        const newUser = new User({
            email,
            password: 'google-auth',
            fullName: name,
            image: picture
        });

        const savedUser = await newUser.save();
        const accessToken = jwt.sign(
            { email: savedUser.email, userId: savedUser._id },
            jwtSecret,
            { expiresIn: '1h' }
        );
        const refreshToken = jwt.sign(
            { userId: savedUser._id },
            jwtRefreshTokenSecret,
        );
        res.status(201).json({
            message: 'User created!',
            userId: savedUser._id,
            accessToken,
            refreshToken
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering new user', error: error.message || error });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) throw 'missing parameters';
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Authentication failed: user not found.' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Authentication failed: incorrect password.' });
        }

        const accessToken = jwt.sign(
            { email: user.email, userId: user._id },
            jwtSecret,
            { expiresIn: '1h' }
        );
        const refreshToken = jwt.sign(
            { userId: user._id },
            jwtRefreshTokenSecret,
        );
        res.status(200).json({
            message: 'User Logged In successfully!',
            userId: user._id,
            accessToken,
            refreshToken
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message || error });
    }
};

exports.loginUserWithGoogle = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Authentication failed: user not found.' });
        }
        const accessToken = jwt.sign(
            { email: email, userId: user._id },
            jwtSecret,
            { expiresIn: '1h' }
        );
        const refreshToken = jwt.sign(
            { userId: savedUser._id },
            jwtRefreshTokenSecret,
        );
        res.status(201).json({
            message: 'User Logged In successfully with Google!',
            userId: user._id,
            accessToken,
            refreshToken
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering new user with google', error: error.message || error });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const { fullName } = JSON.parse(req.body.jsonData);
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        if (fullName && user.fullName !== fullName) {
            user.fullName = fullName;
        }
        if (req.file?.path && user.image !== req.file.path) {
            user.image = req.file.path;
        }
        await user.save();

        res.status(200).json({
            message: 'User profile updated'
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user profile', error: error.message || error });
    }
};

exports.deleteUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        await User.findByIdAndRemove(user._id);

        res.status(200).json({ message: 'User profile deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user profile', error: error.message || error });
    }
};