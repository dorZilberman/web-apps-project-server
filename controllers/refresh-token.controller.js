const jwt = require('jsonwebtoken');
const User = require('../models/user/user');

exports.refreshToken = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) return res.sendStatus(401); // if there isn't any token

    jwt.verify(token, process.env.JWT_SECRET_TOKEN, async (err, userInfo) => {
        if (err) return res.status(403).send(err.message); // if the token has expired or is invalid

        const userId = userInfo._id;
        try {
            const user = await User.findById(userId);

            if (user == null) return res.status(403).send('User does not exist');
            if (!user.tokens.includes(token)) {
                user.tokens = [];
                await user.save();
                return res.status(403).send('Invalid request');
            }
            const accessToken = jwt.sign(
                { email: user.email, userId: user._id },
                jwtSecret,
                { expiresIn: '1h' }
            );
            const refreshToken = jwt.sign(
                { userId: savedUser._id },
                jwtRefreshTokenSecret,
            );
            user.tokens[user.tokens.indexOf(token)] = refreshToken;
            await user.save();
            res.status(200).save({
                accessToken,
                refreshToken
            })
        } catch (error) {
            res.status(403).send(err.message);
        }
    });
};

