
const express = require('express');
const db = require('../config/db');

const router = express.Router();

const selectAll = db.prepare('SELECT id, name, type, icon, status FROM devices ORDER BY id');
const updateStatus = db.prepare(
  'UPDATE devices SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
);

// Convert the DB row into the shape the app's device type expects
const toDevice = (row) => ({
  id: row.id,
  name: row.name,
  type: row.type,
  icon: row.icon,
  status: row.status === 1,
});

// GET /api/devices
router.get('/', (req, res) => {
  try {
    res.json(selectAll.all().map(toDevice));
  } catch (err) {
    console.error('GET /devices failed:', err.message);
    res.status(500).json({ error: 'Unable to retrieve devices.' });
  }
});

// PATCH /api/devices/:id   body: { "status": true | false }
router.patch('/:id', (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body ?? {};

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid device id.' });
  }
  if (typeof status !== 'boolean') {
    return res.status(400).json({ error: 'status must be true or false.' });
  }

  try {
    const result = updateStatus.run(status ? 1 : 0, id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Device not found.' });
    }
    res.json({ id, status });
  } catch (err) {
    console.error('PATCH /devices failed:', err.message);
    res.status(500).json({ error: 'Unable to update device.' });
  }
});

module.exports = router;
