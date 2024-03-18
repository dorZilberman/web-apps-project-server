const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
require('dotenv').config({ path: './environment.env' });


mongoose.connect("mongodb://admin:bartar20%40CS@10.10.248.198:21771/", { useNewUrlParser: true }).then(() => {
    const app = express();
    app.use(express.json());

    // if (process.env.NODE_ENV == "development") {
        const options = {
        definition: {
        openapi: "3.0.0",
        info: {
        title: "Web Dev 2024 REST API",
        version: "1.0.0",
        description: "REST server including authentication using JWT",
        },
        servers: [{url: "http://localhost:3001",},],
        },
        apis: ["./routes/*.js"],
        };
        const specs = swaggerJsDoc(options);
        app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
    //    }
    const corsOptions = {
        origin: 'http://localhost:3000',
    };
      
    app.use(cors(corsOptions));

    app.use('/', require('./routes/index.controller'));
    app.use('/users', require('./routes/users'));
    app.use('/posts', require('./routes/posts'));
    app.use('/comments', require('./routes/comments'));
    app.use('/public', express.static('public'));

    app.listen(3001, () => {
        console.log("Server has started!")
    });
});
