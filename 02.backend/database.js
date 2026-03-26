const sqlite3 = require('@journeyapps/sqlcipher').verbose();
const path = require('path');
const fs = require('fs');

let db;

function initDatabase(key) {
  const dbPath = path.join(__dirname, 'weget-todo.db');
  
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Failed to open database:', err.message);
    } else {
      console.log('Connected to the SQLite database.');
      // Execute Pragma
      db.serialize(() => {
        db.run(`PRAGMA key = '${key}'`);
        
        // Create Todos Table
        db.run(`
          CREATE TABLE IF NOT EXISTS todos (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            content TEXT,
            priority TEXT CHECK(priority IN ('high', 'medium', 'low')),
            due_date TEXT,
            tags TEXT,
            completed INTEGER DEFAULT 0,
            completed_at TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Create Events Table
        db.run(`
          CREATE TABLE IF NOT EXISTS events (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            content TEXT,
            start_date TEXT NOT NULL,
            end_date TEXT,
            recurrence_type TEXT CHECK(recurrence_type IN ('none', 'daily', 'weekly', 'monthly', 'yearly')),
            recurrence_rule TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
          )
        `);
      });
    }
  });
}

function getDb() {
  return db;
}

module.exports = {
  initDatabase,
  getDb
};
