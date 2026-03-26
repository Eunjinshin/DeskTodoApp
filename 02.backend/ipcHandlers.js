const { ipcMain } = require('electron');
const { getDb } = require('./database');
const { v4: uuidv4 } = require('uuid');

function registerIpcHandlers() {
  const db = getDb();

  // === TODO Handlers ===
  ipcMain.handle('todo-get-all', async (event, filters) => {
    return new Promise((resolve, reject) => {
      let query = "SELECT * FROM todos WHERE 1=1";
      const params = [];

      if (filters?.date) {
        query += " AND due_date LIKE ?";
        params.push(`${filters.date}%`);
      }
      if (filters?.tag) {
        query += " AND tags LIKE ?";
        params.push(`%${filters.tag}%`);
      }
      if (filters?.completed !== undefined) {
        query += " AND completed = ?";
        params.push(filters.completed ? 1 : 0);
      }

      query += ` ORDER BY 
        CASE priority 
          WHEN 'high' THEN 1 
          WHEN 'medium' THEN 2 
          WHEN 'low' THEN 3 
          ELSE 4 
        END ASC,
        due_date ASC`;

      db.all(query, params, (err, rows) => {
        if (err) {
          console.error("todo-get-all Error:", err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  });

  ipcMain.handle('todo-create', async (event, todo) => {
    return new Promise((resolve, reject) => {
      const id = uuidv4();
      const { title, content, priority, due_date, tags } = todo;
      const stmt = db.prepare(`
        INSERT INTO todos (id, title, content, priority, due_date, tags)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      stmt.run([id, title, content, priority, due_date, tags], function(err) {
        if (err) {
          console.error("todo-create Error:", err);
          reject(err);
        } else {
          resolve({ id, ...todo });
        }
      });
      stmt.finalize();
    });
  });

  ipcMain.handle('todo-update', async (event, id, updates) => {
    return new Promise((resolve, reject) => {
      const fields = Object.keys(updates);
      const values = Object.values(updates);
      if (fields.length === 0) return resolve(false);

      const setClause = fields.map(f => `${f} = ?`).join(', ');
      
      const query = `UPDATE todos SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      values.push(id);

      db.run(query, values, function(err) {
        if (err) {
          console.error("todo-update Error:", err);
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  });

  ipcMain.handle('todo-delete', async (event, id) => {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM todos WHERE id = ?", [id], function(err) {
        if (err) {
          console.error("todo-delete Error:", err);
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  });

  // === Event Handlers ===
  ipcMain.handle('event-get-all', async (event, filters) => {
    return new Promise((resolve, reject) => {
      let query = "SELECT * FROM events WHERE 1=1";
      const params = [];
      
      // If we want to filter by start_date or month (example)
      if (filters?.month) {
        query += " AND start_date LIKE ?";
        params.push(`${filters.month}%`);
      }

      query += " ORDER BY start_date ASC";

      db.all(query, params, (err, rows) => {
        if (err) {
          console.error("event-get-all Error:", err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  });

  ipcMain.handle('event-create', async (event, ev) => {
    return new Promise((resolve, reject) => {
      const id = uuidv4();
      const { title, content, start_date, end_date, recurrence_type, recurrence_rule } = ev;
      const stmt = db.prepare(`
        INSERT INTO events (id, title, content, start_date, end_date, recurrence_type, recurrence_rule)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run([id, title, content, start_date, end_date, recurrence_type, recurrence_rule], function(err) {
        if (err) {
          console.error("event-create Error:", err);
          reject(err);
        } else {
          resolve({ id, ...ev });
        }
      });
      stmt.finalize();
    });
  });

  ipcMain.handle('event-update', async (event, id, updates) => {
    return new Promise((resolve, reject) => {
      const fields = Object.keys(updates);
      const values = Object.values(updates);
      if (fields.length === 0) return resolve(false);

      const setClause = fields.map(f => `${f} = ?`).join(', ');
      
      const query = `UPDATE events SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      values.push(id);

      db.run(query, values, function(err) {
        if (err) {
          console.error("event-update Error:", err);
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  });

  ipcMain.handle('event-delete', async (event, id) => {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM events WHERE id = ?", [id], function(err) {
        if (err) {
          console.error("event-delete Error:", err);
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  });
}

module.exports = {
  registerIpcHandlers
};
