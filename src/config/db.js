const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("database.sqlite");

db.serialize(() => {
  /* =========================
     🧱 CORE BUSINESS TABLE
     ========================= */
  db.run(`
    CREATE TABLE IF NOT EXISTS businesses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT,
      address TEXT,
      lat REAL,
      lon REAL,
      lead_type TEXT,
      UNIQUE(name, lat, lon)
    )
  `);

  /* =========================
     🌐 DIGITAL PRESENCE TABLE
     ========================= */
  db.run(`
    CREATE TABLE IF NOT EXISTS business_websites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_id INTEGER,
      website TEXT,
      source TEXT,
      has_website BOOLEAN,
      FOREIGN KEY (business_id) REFERENCES businesses(id)
    )
  `);

  /* =========================
     🧠 WEBSITE AUDIT TABLE
     ========================= */
  db.run(`
    CREATE TABLE IF NOT EXISTS website_audits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_id INTEGER,
      website TEXT,
      score INTEGER,
      audit_json TEXT,
      audited_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (business_id) REFERENCES businesses(id)
    )
  `);

  /* =========================
     🚀 LEAD ACTIONS TABLE
     ========================= */
  db.run(`
    CREATE TABLE IF NOT EXISTS lead_actions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_id INTEGER,
      action TEXT,
      scheduled_for DATETIME,
      status TEXT DEFAULT 'PENDING',
      FOREIGN KEY (business_id) REFERENCES businesses(id)
    )
  `);
});

module.exports = db;
