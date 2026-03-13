/**
 * DB 쿼리 모듈 (2차 기능 보완)
 * - 우선순위 DESC 정렬 (상이 먼저)
 * - tag 필드 지원
 * - Schedule에 recurrence 필드 지원
 */
const { v4: uuidv4 } = require('uuid');

function dbQuery(db, method, sql, params = []) {
  return new Promise((resolve, reject) => {
    db[method](sql, params, function (err, result) {
      if (err) reject(err);
      else resolve(method === 'run' ? { lastID: this.lastID, changes: this.changes } : result);
    });
  });
}
const dbAll = (db, sql, params) => dbQuery(db, 'all', sql, params);
const dbGet = (db, sql, params) => dbQuery(db, 'get', sql, params);
const dbRun = (db, sql, params) => dbQuery(db, 'run', sql, params);

function logAudit(db, action, targetId, detail, type = 'todo') {
  dbRun(db,
    'INSERT INTO audit_log (action, target_id, target_type, detail) VALUES (?, ?, ?, ?)',
    [action, targetId, type, detail]
  ).catch((err) => console.error('[감사로그] 기록 실패:', err.message));
}

// ── TODO CRUD ──

async function createTodo(db, data) {
  const id = uuidv4();
  const { title, content = null, priority = 0, dueDate = null, tag = null } = data;
  await dbRun(db,
    'INSERT INTO todos (id, title, content, priority, due_date, tag) VALUES (?, ?, ?, ?, ?, ?)',
    [id, title, content, priority, dueDate, tag]
  );
  logAudit(db, 'CREATE', id, title);
  return dbGet(db, 'SELECT * FROM todos WHERE id = ?', [id]);
}

async function getTodo(db, id) {
  return dbGet(db, 'SELECT * FROM todos WHERE id = ?', [id]);
}

/** 목록: 우선순위 내림차순(상→중→하), 미완료 먼저, 생성일 내림차순 */
async function listTodos(db) {
  return dbAll(db, 'SELECT * FROM todos ORDER BY is_done ASC, priority DESC, created_at DESC');
}

async function updateTodo(db, data) {
  const { id, title, content, isDone, priority, dueDate, tag } = data;
  const existing = await getTodo(db, id);
  if (!existing) return undefined;

  let completedAt = existing.completed_at;
  if (isDone !== undefined) {
    completedAt = isDone ? new Date().toISOString() : null;
  }

  const updated = {
    title: title !== undefined ? title : existing.title,
    content: content !== undefined ? content : existing.content,
    is_done: isDone !== undefined ? (isDone ? 1 : 0) : existing.is_done,
    priority: priority !== undefined ? priority : existing.priority,
    due_date: dueDate !== undefined ? dueDate : existing.due_date,
    tag: tag !== undefined ? tag : existing.tag,
    completed_at: completedAt,
  };

  await dbRun(db,
    `UPDATE todos SET title=?, content=?, is_done=?, priority=?, due_date=?,
     tag=?, completed_at=?, updated_at=datetime('now','localtime') WHERE id=?`,
    [updated.title, updated.content, updated.is_done, updated.priority,
     updated.due_date, updated.tag, updated.completed_at, id]
  );
  logAudit(db, 'UPDATE', id, updated.title);
  return dbGet(db, 'SELECT * FROM todos WHERE id = ?', [id]);
}

async function deleteTodo(db, id) {
  const existing = await getTodo(db, id);
  if (!existing) return false;
  await dbRun(db, 'DELETE FROM todos WHERE id = ?', [id]);
  logAudit(db, 'DELETE', id, existing.title);
  return true;
}

// ── Schedule CRUD (recurrence 지원) ──

const VALID_RECURRENCE = ['once', 'daily', 'weekly', 'monthly', 'yearly'];

async function createSchedule(db, data) {
  const id = uuidv4();
  const { title, content = null, startDate, endDate = null, color = '#667eea', recurrence = 'once' } = data;
  const rec = VALID_RECURRENCE.includes(recurrence) ? recurrence : 'once';
  await dbRun(db,
    'INSERT INTO schedules (id, title, content, start_date, end_date, color, recurrence) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, title, content, startDate, endDate, color, rec]
  );
  logAudit(db, 'CREATE', id, title, 'schedule');
  return dbGet(db, 'SELECT * FROM schedules WHERE id = ?', [id]);
}

async function listSchedules(db) {
  return dbAll(db, 'SELECT * FROM schedules ORDER BY start_date');
}

async function updateSchedule(db, data) {
  const { id, title, content, startDate, endDate, color, recurrence } = data;
  const existing = await dbGet(db, 'SELECT * FROM schedules WHERE id = ?', [id]);
  if (!existing) return undefined;

  const updated = {
    title: title !== undefined ? title : existing.title,
    content: content !== undefined ? content : existing.content,
    start_date: startDate !== undefined ? startDate : existing.start_date,
    end_date: endDate !== undefined ? endDate : existing.end_date,
    color: color !== undefined ? color : existing.color,
    recurrence: (recurrence && VALID_RECURRENCE.includes(recurrence)) ? recurrence : existing.recurrence,
  };

  await dbRun(db,
    `UPDATE schedules SET title=?, content=?, start_date=?, end_date=?, color=?, recurrence=?,
     updated_at=datetime('now','localtime') WHERE id=?`,
    [updated.title, updated.content, updated.start_date, updated.end_date, updated.color, updated.recurrence, id]
  );
  logAudit(db, 'UPDATE', id, updated.title, 'schedule');
  return dbGet(db, 'SELECT * FROM schedules WHERE id = ?', [id]);
}

async function deleteSchedule(db, id) {
  const existing = await dbGet(db, 'SELECT * FROM schedules WHERE id = ?', [id]);
  if (!existing) return false;
  await dbRun(db, 'DELETE FROM schedules WHERE id = ?', [id]);
  logAudit(db, 'DELETE', id, existing.title, 'schedule');
  return true;
}

module.exports = {
  createTodo, getTodo, listTodos, updateTodo, deleteTodo,
  createSchedule, listSchedules, updateSchedule, deleteSchedule,
};
