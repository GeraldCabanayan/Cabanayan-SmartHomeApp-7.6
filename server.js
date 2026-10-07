require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./server/config/db'); // opens (and creates) the SQLite database

const app = express();

app.use(cors());
app.use(express.json({ limit: '10kb' })); // small body limit

app.use('/api/devices', require('./server/routes/devices'));
app.use('/api/sensors', require('./server/routes/sensors'));

// Fallback for malformed JSON etc. (never leak internals to the client)
app.use((err, req, res, next) => {
  res.status(400).json({ error: 'Bad request.' });
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log('Connected to SQLite database.');
  console.log(`API running on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});
