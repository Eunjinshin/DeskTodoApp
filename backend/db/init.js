/**
 * SQLCipher DB 초기화 모듈
 * - [P2] PRAGMA key 이스케이프 처리
 * - [P11] 주석/코드 일치
 */
const sqlite3 = require('@journeyapps/sqlcipher');
const { createTables } = require('./schema');

/**
 * passphrase 내 싱글 쿼트를 이스케이프
 * SQLCipher PRAGMA key는 Prepared Statement 미지원이므로 수동 이스케이프 필요
 */
function escapePassphrase(passphrase) {
  return passphrase.replace(/'/g, "''");
}

/**
 * SQLCipher 암호화 DB 초기화
 * @param {string} dbPath - DB 파일 경로
 * @param {string} passphrase - 암호화 passphrase
 * @returns {sqlite3.Database}
 */
function initDB(dbPath, passphrase) {
  const db = new sqlite3.Database(dbPath);

  db.serialize(() => {
    // [P2] 이스케이프된 passphrase로 PRAGMA key 설정
    db.run(`PRAGMA key = '${escapePassphrase(passphrase)}'`);
    db.run('PRAGMA cipher_compatibility = 4');
    db.run('PRAGMA journal_mode = WAL');
    db.run('PRAGMA foreign_keys = ON');

    createTables(db);
  });

  return db;
}

module.exports = { initDB };
