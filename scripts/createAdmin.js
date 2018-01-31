const mongoose = require('mongoose');
const config = require('../config');
const { User } = require('../models');


mongoose.Promise = global.Promise;

// Add admin user to the database
const password = 'password';
const email = 'admin@mailinator.com';
const firstName = 'admin';
const lastName = 'admin';
const isActive = true;
const isAdmin = true;

const admin = new User({
  email,
  firstName,
  lastName,
  password,
  isActive,
  isAdmin,
});

admin.save()
  .then(() => {
    console.log('Successfully added admin');
    process.exit();
  })
  .catch((error) => {
    console.log('Error', error);
    process.exit();
  });


// Create the database connection
mongoose.connect(config.db(), { server: { reconnectTries: Number.MAX_VALUE } });

mongoose.connection.on('connected', () => {
  console.log(`Mongoose default connection open to ${config.db()}`);
});

// CONNECTION EVENTS
// If the connection throws an error
mongoose.connection.on('error', (err) => {
  console.log(`Mongoose default connection error: ${err}`);
  process.exit(0);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});

// When the connection is open
mongoose.connection.on('open', () => {
  console.log('Mongoose default connection is open');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});
