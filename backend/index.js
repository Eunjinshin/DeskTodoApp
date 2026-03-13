/**
 * Main Process 엔트리포인트 (리팩토링)
 * - web-contents-created 이벤트 통합
 * - 개발 모드 네비게이션 허용
 */
const { app, session } = require('electron');
const { createWindow } = require('./window');
const { registerHandlers } = require('./ipc-handlers');
const { initDB } = require('./db/init');
const { KeyManager } = require('./security/key-mgr');
const path = require('path');

// ── 단일 인스턴스 잠금 ──
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
}

let db = null;

app.on('ready', async () => {
  const isProd = app.isPackaged;

  // ── CSP (개발/프로덕션 분기) ──
  const csp = isProd
    ? "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;"
    : "default-src 'self' http://localhost:5173; script-src 'self' 'unsafe-inline' http://localhost:5173; connect-src ws://localhost:5173 http://localhost:5173; style-src 'self' 'unsafe-inline'; img-src 'self' data:;";

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: { ...details.responseHeaders, 'Content-Security-Policy': [csp] }
    });
  });

  // ── 보안 이벤트 (통합) ──
  app.on('web-contents-created', (_event, contents) => {
    // 외부 URL 네비게이션 차단 (개발 모드 localhost 허용)
    contents.on('will-navigate', (navEvent, url) => {
      const allowed = url.startsWith('file://') ||
        (!isProd && url.startsWith('http://localhost'));
      if (!allowed) navEvent.preventDefault();
    });
    contents.setWindowOpenHandler(() => ({ action: 'deny' }));
    // WebView 차단
    contents.on('will-attach-webview', (event) => event.preventDefault());
  });

  // ── DB 초기화 ──
  const dbPath = path.join(app.getPath('userData'), 'weget-todo.db');
  const passphrase = await KeyManager.getOrCreateKey(app.getPath('userData'));
  db = initDB(dbPath, passphrase);

  // ── IPC + Window ──
  registerHandlers(db);
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (db) db.close((err) => { if (err) console.error('DB 닫기 실패:', err.message); });
});
