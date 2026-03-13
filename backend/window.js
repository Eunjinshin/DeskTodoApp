/**
 * BrowserWindow 생성 모듈 (리팩토링)
 * - 프레임리스 윈도우 (커스텀 타이틀바용)
 * - 투명도 지원
 * - 보안 옵션 유지
 */
const { BrowserWindow, app } = require('electron');
const path = require('path');

let mainWindow = null;

function createWindow() {
  const isProd = app.isPackaged;

  mainWindow = new BrowserWindow({
    width: 420,
    height: 600,
    minWidth: 320,
    minHeight: 400,
    frame: false,          // 프레임리스 (커스텀 타이틀바)
    transparent: false,    // 네이티브 리사이즈 활성화
    resizable: true,
    alwaysOnTop: false,    // 핀 기능으로 토글
    title: 'WeGet TODO',
    backgroundColor: '#1e1e2e', // 앱 기본 배경색
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(__dirname, '../preload/preload.js'),
      webSecurity: true,
      allowRunningInsecureContent: false,
      enableRemoteModule: false,
      spellcheck: false,
    }
  });

  // ── HTML 로드 (개발/프로덕션 분기) ──
  if (isProd) {
    mainWindow.loadFile(path.join(__dirname, '../frontend/dist/index.html'));
  } else {
    mainWindow.loadURL('http://localhost:5173');
  }

  // ── 프로덕션 DevTools 비활성화 ──
  if (isProd) {
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools();
    });
  }

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  return mainWindow;
}

function getMainWindow() {
  return mainWindow;
}

module.exports = { createWindow, getMainWindow };
