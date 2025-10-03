require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5176',
    'http://localhost:8080',
    'http://localhost:8081'
  ]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB
const db = require('./app/models');
db.sequelize.sync({ alter: false })
  .then(() => console.log('Database synced successfully.'))
  .catch(err => console.error('Failed to sync database:', err));

// Health check
app.get('/', (_req, res) => res.json({ message: 'Welcome to Courses application.' }));

// Routes
require('./app/routes/courses')(app);

// Start
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));
