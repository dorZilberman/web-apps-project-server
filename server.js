const express = require('express');
const mongoose = require("mongoose");
require('dotenv').config();


mongoose.connect("mongodb://admin:bartar20%40CS@10.10.248.198:21771/", { useNewUrlParser: true }).then(() => {
    const app = express();
    app.use(express.json());

    app.listen(3001, () => {
        console.log("Server has started!")
    });

    app.use('/', require('./routes/index.controller'));
    app.use('/users', require('./routes/users'));
    app.use('/posts', require('./routes/posts'));
});







