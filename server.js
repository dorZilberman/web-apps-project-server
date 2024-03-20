const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
require('dotenv').config({ path: './environment.env' });

// This function will initialize the app and connect to the database
function initApp() {
  return new Promise((resolve, reject) => {
    // Connect to MongoDB
    mongoose.connect("mongodb://admin:bartar20%40CS@10.10.248.198:21771/", { useNewUrlParser: true });
    
    // Handle connection errors and success
    const db = mongoose.connection;
    db.on('error', (error) => {
      console.error('Connection error:', error);
      reject(error); // Reject the promise on connection error
    });
    db.on('open', () => {
      console.log('Connected to MongoDB');

      // Create and configure the Express app after a successful database connection
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

      resolve(app); // Resolve the promise with the configured app
    });
  });
}

module.exports = initApp; // Export the function instead of the app
