

CREATE TABLE IF NOT EXISTS devices (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL,
  type       TEXT    NOT NULL,
  icon       TEXT    NOT NULL DEFAULT 'help-outline',
  status     INTEGER NOT NULL DEFAULT 0 CHECK (status IN (0, 1)),
  updated_at TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sensor_readings (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  temperature REAL    NOT NULL,
  humidity    REAL    NOT NULL,
  light_level INTEGER NOT NULL,
  recorded_at TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_recorded_at ON sensor_readings (recorded_at);
