const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const googleAuthMiddleware = {};

googleAuthMiddleware.verifyToken = async (req, res, next) => {
    const client = new OAuth2Client();
    const credential = req.body.credential;
    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        req.body = payload;
        next();
    } catch (err) {
        return res.status(400).send("error missing email or password");
    }
};

module.exports = googleAuthMiddleware;
