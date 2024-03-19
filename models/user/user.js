const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        default: ''
    },
    tokens: {
        type: [String]
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);