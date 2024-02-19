const express = require('express');
const mongoose = require("mongoose")


mongoose.connect("mongodb://admin:bartar20%40CS@10.10.248.198:21771/", { useNewUrlParser: true }).then(() => {
    const app = express();
    app.use(express.json());

    app.listen(3000, () => {
        console.log("Server has started!")
    });

    app.use('/', require('./routes/index/index.controller'));
    app.use('/posts', require('./routes/posts/posts.controller'));
});







