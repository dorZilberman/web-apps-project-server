const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
require('dotenv').config({ path: './environment.env' });


mongoose.connect("mongodb://admin:bartar20%40CS@10.10.248.198:21771/", { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.on('open', () => console.log('connected to mongo'));

const app = express();
app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:3000',
};

app.use(cors(corsOptions));

app.use('/', require('./routes/index.controller'));
app.use('/users', require('./routes/users'));
app.use('/posts', require('./routes/posts'));
app.use('/comments', require('./routes/comments'));
app.use('/public', express.static('public'));

module.exports = app;
