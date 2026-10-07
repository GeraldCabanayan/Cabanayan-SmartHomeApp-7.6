
const express = require('express');
const db = require('../config/db');

const router = express.Router();

const selectLatest = db.prepare(
  `SELECT temperature, humidity, light_level
     FROM sensor_readings
    ORDER BY recorded_at DESC, id DESC
    LIMIT 1`
);
const insertReading = db.prepare(
  'INSERT INTO sensor_readings (temperature, humidity, light_level) VALUES (?, ?, ?)'
);

// GET /api/sensors  -> latest reading
router.get('/', (req, res) => {
  try {
    const r = selectLatest.get();
    if (!r) {
      return res.status(404).json({ error: 'No sensor data available.' });
    }
    res.json({
      temperature: r.temperature,
      humidity: r.humidity,
      lightLevel: r.light_level,
    });
  } catch (err) {
    console.error('GET /sensors failed:', err.message);
    res.status(500).json({ error: 'Unable to retrieve sensor data.' });
  }
});

// POST /api/sensors  body: { temperature, humidity, lightLevel }
router.post('/', (req, res) => {
  const { temperature, humidity, lightLevel } = req.body ?? {};

  const isNum = (v, min, max) =>
    typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max;

  if (
    !isNum(temperature, -50, 100) ||
    !isNum(humidity, 0, 100) ||
    !isNum(lightLevel, 0, 100000)
  ) {
    return res.status(400).json({ error: 'Invalid sensor values.' });
  }

  try {
    insertReading.run(temperature, humidity, Math.round(lightLevel));
    res.status(201).json({ temperature, humidity, lightLevel });
  } catch (err) {
    console.error('POST /sensors failed:', err.message);
    res.status(500).json({ error: 'Unable to save sensor data.' });
  }
});

module.exports = router;
