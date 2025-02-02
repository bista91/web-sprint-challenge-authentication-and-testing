const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const restrict = require('./middleware/restricted.js');

const authRouter = require('./auth/auth-router.js');
const jokesRouter = require('./jokes/jokes-router.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/jokes', restrict, jokesRouter); // only logged-in users should have access!

// Create an HTTP server instance
const httpServer = server.listen(process.env.PORT || 9000, () => {
  console.log(`\n=== Server listening on port ${httpServer.address().port} ===\n`);
});

module.exports = { server, httpServer };  // Export both express server and http server
