const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
require('dotenv').config({ path: './environment.env' });

function initApp() {
  return new Promise((resolve, reject) => {
    mongoose.connect("mongodb://admin:bartar20%40CS@10.10.248.198:21771/", { useNewUrlParser: true });
    
    const db = mongoose.connection;
    db.on('error', (error) => {
      console.error('Connection error:', error);
      reject(error);
    });
    db.on('open', () => {
      console.log('Connected to MongoDB');

      const app = express();
      app.use(express.json());

      const corsOptions = {
        origin: 'https://node38.cs.colman.ac.il:4002',
      };

      app.use(cors(corsOptions));
      app.use('/', require('./routes/index.controller'));
      app.use('/users', require('./routes/users'));
      app.use('/posts', require('./routes/posts'));
      app.use('/comments', require('./routes/comments'));
      app.use('/public', express.static('public'));

      resolve(app);
    });
  });
}

module.exports = initApp;
