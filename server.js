const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
require('dotenv').config({ path: './environment.env' });


mongoose.connect("mongodb://admin:bartar20%40CS@10.10.248.198:21771/", { useNewUrlParser: true }).then(() => {
    const app = express();
    app.use(express.json());

    app.listen(3001, () => {
        console.log("Server has started!")
    });
    const corsOptions = {
        origin: 'http://localhost:3000',
    };
      
    app.use(cors(corsOptions));

    app.use('/', require('./routes/index.controller'));
    app.use('/users', require('./routes/users'));
    app.use('/posts', require('./routes/posts'));
    app.use('/comments', require('./routes/comments'));
});







