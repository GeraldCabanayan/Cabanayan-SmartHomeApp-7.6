
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

// The SQLite database is just one file. Default: database/smarthome.db
const dbPath = process.env.DB_FILE
  ? path.resolve(process.env.DB_FILE)
  : path.join(__dirname, '..', '..', 'database', 'smarthome.db');

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create the tables if they do not exist yet.
const dbDir = path.join(__dirname, '..', '..', 'database');
db.exec(fs.readFileSync(path.join(dbDir, 'schema.sql'), 'utf8'));

// Insert the sample data only the first time (when the tables are empty).
const deviceCount = db.prepare('SELECT COUNT(*) AS n FROM devices').get().n;
const readingCount = db.prepare('SELECT COUNT(*) AS n FROM sensor_readings').get().n;
if (deviceCount === 0 && readingCount === 0) {
  db.exec(fs.readFileSync(path.join(dbDir, 'seed.sql'), 'utf8'));
}

module.exports = db;
