// Clean resolved server.js (removed merge conflict markers)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// CORS configuration (optionally override with CORS_ORIGINS=origin1,origin2)
const allowedOrigins = (process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(s => s.trim()).filter(Boolean)
  : [
    'http://localhost:5173',
    'http://localhost:5176',
    'http://localhost:8080',
    'http://localhost:8081'
  ]);
console.log('Allowed CORS origins:', allowedOrigins);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS not allowed for this origin: ' + origin));
  },
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Basic request logger
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// Database
const db = require('./app/models');
db.sequelize.sync({ alter: false })
  .then(() => console.log('Database synced successfully.'))
  .catch(err => console.error('Failed to sync database:', err));

// Auth stub
app.post('/auth/login', (req, res) => {
  const { username } = req.body || {};
  if (!username) return res.status(400).json({ error: 'username required' });
  const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
  res.json({ token, user: { username } });
});

// Health endpoint
app.get('/health', async (_req, res) => {
  try {
    await db.sequelize.authenticate();
    return res.json({ status: 'ok', db: 'up', time: new Date().toISOString() });
  } catch (e) {
    return res.status(500).json({ status: 'degraded', db: 'down', error: e.message });
  }
});

// Root route
app.get('/', (_req, res) => {
  res.json({ message: 'Welcome to Courses application.' });
});

// API routes
require('./app/routes/courses')(app);

// Error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

process.on('unhandledRejection', r => console.error('UnhandledRejection:', r));
process.on('uncaughtException', e => console.error('UncaughtException:', e));

module.exports = { app, server };
