/**
 * DB 스키마 정의 (리팩토링)
 * - 마이그레이션 배열에 audit_log 컬럼명 변경 추가 (P1)
 * - 에러 로깅 개선 (P10)
 */

const CREATE_TODOS = `
  CREATE TABLE IF NOT EXISTS todos (
    id           TEXT PRIMARY KEY,
    title        TEXT NOT NULL,
    content      TEXT,
    tag          TEXT,
    is_done      INTEGER DEFAULT 0,
    priority     INTEGER DEFAULT 0,
    due_date     TEXT,
    completed_at TEXT,
    created_at   TEXT DEFAULT (datetime('now', 'localtime')),
    updated_at   TEXT DEFAULT (datetime('now', 'localtime'))
  )
`;

const CREATE_SCHEDULES = `
  CREATE TABLE IF NOT EXISTS schedules (
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    content     TEXT,
    start_date  TEXT NOT NULL,
    end_date    TEXT,
    recurrence  TEXT DEFAULT 'once',
    color       TEXT DEFAULT '#667eea',
    created_at  TEXT DEFAULT (datetime('now', 'localtime')),
    updated_at  TEXT DEFAULT (datetime('now', 'localtime'))
  )
`;

const CREATE_AUDIT_LOG = `
  CREATE TABLE IF NOT EXISTS audit_log (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    action      TEXT NOT NULL,
    target_id   TEXT NOT NULL,
    target_type TEXT DEFAULT 'todo',
    timestamp   TEXT DEFAULT (datetime('now', 'localtime')),
    detail      TEXT
  )
`;

const CREATE_APP_CONFIG = `
  CREATE TABLE IF NOT EXISTS app_config (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )
`;

/**
 * 마이그레이션 목록 (기존 DB 호환)
 * - ALTER TABLE은 이미 존재하면 'duplicate column' 에러 → 무시
 * - RENAME COLUMN은 이미 완료되면 'no such column' 에러 → 무시
 */
const MIGRATIONS = [
  // todos 컬럼 추가
  'ALTER TABLE todos ADD COLUMN completed_at TEXT',
  'ALTER TABLE todos ADD COLUMN tag TEXT',
  // schedules 컬럼 추가
  "ALTER TABLE schedules ADD COLUMN recurrence TEXT DEFAULT 'once'",
  // [P1] audit_log: 기존 todo_id → target_id 컬럼명 변경
  'ALTER TABLE audit_log RENAME COLUMN todo_id TO target_id',
  // [P1] audit_log: target_type 컬럼 추가
  'ALTER TABLE audit_log ADD COLUMN target_type TEXT DEFAULT \'todo\'',
];

function createTables(db) {
  db.run(CREATE_TODOS);
  db.run(CREATE_SCHEDULES);
  db.run(CREATE_AUDIT_LOG);
  db.run(CREATE_APP_CONFIG);

  // 마이그레이션 실행 (이미 적용된 항목은 에러 무시)
  MIGRATIONS.forEach(sql => {
    db.run(sql, (err) => {
      if (err) {
        const msg = err.message.toLowerCase();
        // 정상적으로 무시할 에러 패턴
        const ignorable = msg.includes('duplicate') || msg.includes('no such column');
        if (!ignorable) {
          console.warn('[마이그레이션] 주의:', sql.slice(0, 50), '→', err.message);
        }
      }
    });
  });
}

module.exports = { createTables };
