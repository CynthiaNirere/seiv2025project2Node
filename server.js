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
app.use(express.urlencoded({ extended: true }));

// ----- BASIC REQUEST LOGGER -----
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

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
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

process.on('unhandledRejection', r => console.error('UnhandledRejection:', r));
process.on('uncaughtException', e => {
  console.error('UncaughtException:', e);
});

module.exports = { app, server }; // for future testing