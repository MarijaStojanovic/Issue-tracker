const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const expressJwt = require('express-jwt');
const mongoose = require('mongoose');
const ErrorHandler = require('./middlewares/errorHandler');
const lusca = require('lusca');
const jwtHandler = require('./lib/jwtHandler');
const config = require('./config');
const path = require('path');

const port = process.env.PORT || 8010;
const appURL = `http://localhost:${port}/api/v1/`;
mongoose.Promise = global.Promise;

const app = express();

// Application Routes
const UserRoutes = require('./components/user/userRouter');
const IssueRoutes = require('./components/issue/issueRouter');
const CommentRoutes = require('./components/comment/commentRouter');

app.use(cors());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());

app.disable('x-powered-by');

// Security
app.use(lusca.xframe('ALLOWALL'));
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

app.use('/uploads', express.static(path.join(__dirname, 'files')));

// Whitelisted routes
app.use(expressJwt({ secret: jwtHandler.getTokenSecret() }).unless({
  path: [
    '/api/v1/signin',
    '/api/v1/issues',
    { url: /\/api\/v1\/issue\/.+/, methods: ['GET'] },
  ],
}));

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

app.use('/api/v1', UserRoutes);
app.use('/api/v1', IssueRoutes);
app.use('/api/v1', CommentRoutes);

app.use(ErrorHandler());

// show env vars
console.log('__________ IssueTracker __________');
console.log(`Starting on port: ${port}`);
console.log(`Env: ${process.env.NODE_ENV}`);
console.log(`App url: ${appURL}`);
console.log('______________________________');

app.listen(port);
module.exports = app;
