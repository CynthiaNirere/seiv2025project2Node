<<<<<<< HEAD
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();

// ----- CORS CONFIG -----
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5176',
  'http://localhost:8080',
  'http://localhost:8081'
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS not allowed for this origin: ' + origin));
  },
  credentials: true,
}));

// ----- BODY PARSING -----
app.use(express.json({ limit: '1mb' }));
=======
require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const app = express();

// Crash diagnostics: log uncaught exceptions/rejections so silent exits are visible.
process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION:', err);
});
process.on('unhandledRejection', err => {
  console.error('UNHANDLED PROMISE REJECTION:', err);
});

var corsOptions = {
  origin: [
    "http://localhost:5176",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://localhost:5173",
    "http://localhost:8080",
    "http://localhost:8081"
  ]
};

// allow credentials (cookies/auth) from these dev origins
var corsOptionsExtended = Object.assign({}, corsOptions, { credentials: true });
app.use(cors(corsOptionsExtended));

// basic request logger (method + url)
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// respond to preflight OPTIONS requests for all routes using the same CORS options
app.options('*', cors(corsOptionsExtended));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
>>>>>>> origin/integrate/lewis
app.use(express.urlencoded({ extended: true }));

// ----- BASIC REQUEST LOGGER -----
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

<<<<<<< HEAD
// ----- DATABASE INIT -----
const db = require('./app/models');
db.sequelize.sync({ alter: false })
  .then(() => console.log('Database synced successfully.'))
  .catch(err => console.error('Failed to sync database:', err));

// ----- AUTH STUB (to be replaced with real auth) -----
app.post('/auth/login', (req, res) => {
  const { username } = req.body || {};
  if (!username) return res.status(400).json({ error: 'username required' });
  // Extremely naive token stub
  const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
  res.json({ token, user: { username } });
});

// ----- HEALTHCHECK -----
app.get('/health', async (_req, res) => {
  try {
    await db.sequelize.authenticate();
    return res.json({ status: 'ok', db: 'up', time: new Date().toISOString() });
  } catch (e) {
    return res.status(500).json({ status: 'degraded', db: 'down', error: e.message });
  }
});

// ----- ROOT ROUTE -----
app.get('/', (_req, res) => {
  res.json({ message: 'Welcome to Courses application.' });
});

// ----- API ROUTES -----
require('./app/routes/courses')(app);

// ----- ERROR HANDLER (last resort) -----
// (Add more specific handlers above if needed)
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ----- SERVER START + DIAGNOSTICS -----
const PORT = process.env.PORT || 8080;
=======
// convenience redirect if frontend calls legacy path
app.get('/courses', (req, res) => res.redirect(301, '/api/courses'));

// health check (can be used by frontend / monitoring)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// --- Auth stub --------------------------------------------------------------
// Minimal in-memory login stub. Replace with real user lookup & password check.
// POST /auth/login { email, password }
// Returns a fake token so the frontend can proceed.
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  console.log('LOGIN ATTEMPT', { email });
  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }
  // TODO: implement real verification
  const fakeToken = Buffer.from(`${email}:dev-token`).toString('base64');
  res.json({ token: fakeToken, user: { email } });
});
// ---------------------------------------------------------------------------

// course routes only
require("./app/routes/courses")(app);

// explicit 404 for unknown /api routes (before SPA fallback)
app.use('/api', (req, res, next) => {
  if (!res.headersSent) {
    return res.status(404).json({ message: 'API route not found', path: req.originalUrl });
  }
  next();
});

// -- Serve frontend (if built) -------------------------------------------------
// If you build your Vue app into a `dist` folder at
// ../seiv2025project2Vue/dist this will serve the static files and provide
// an SPA fallback. API routes (like /courses) are left intact.
const frontendDist = path.resolve(__dirname, '..', 'seiv2025project2Vue', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));

  // SPA fallback — only for non-API GET requests
  app.get('*', (req, res, next) => {
    // protect API routes
    if (req.path.startsWith('/courses') || req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}
// -----------------------------------------------------------------------------

// set port, listen for requests with diagnostics
const PORT = process.env.PORT || 8080;
let serverClosed = false;
>>>>>>> origin/integrate/lewis
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

<<<<<<< HEAD
process.on('unhandledRejection', r => console.error('UnhandledRejection:', r));
process.on('uncaughtException', e => {
  console.error('UncaughtException:', e);
});

module.exports = { app, server }; // for future testing
=======
server.on('close', () => {
  serverClosed = true;
  console.log('Server close event fired');
});

// heartbeat every 5s so we know process is alive
setInterval(() => {
  if (!serverClosed) console.log('[HEARTBEAT]', new Date().toISOString());
}, 5000);

// optional graceful shutdown logs
['SIGINT','SIGTERM'].forEach(sig => {
  process.on(sig, () => {
    console.log(`Received ${sig}, closing server...`);
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
  });
});

>>>>>>> origin/integrate/lewis
