const { app, BrowserWindow, safeStorage } = require('electron');
const path = require('path');
const { initDatabase } = require('./database');
const { registerWindowEvents } = require('./windowEvents');
const { registerIpcHandlers } = require('./ipcHandlers');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    frame: false, // Frameless window
    transparent: true,
    webPreferences: {
      nodeIntegration: false, // Disable for security
      contextIsolation: true, // Enable contextBridge
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load frontend (Assuming Vite runs on 5173 for development)
  const isDev = !app.isPackaged;
  if(isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../03.frontend/dist/index.html'));
  }

  registerWindowEvents(mainWindow);
}

app.whenReady().then(() => {
  // DPAPI safeStorage is available on Windows/Mac
  let encryptionKey;
  if (safeStorage.isEncryptionAvailable()) {
    // Ideal approach: Read encrypted key from disk, decrypt, and use it
    // For now we use a fixed key as a master key stub to be encrypted by safeStorage
    encryptionKey = 'weget-todo-secure-master-key'; 
  } else {
    encryptionKey = 'fallback-insecure-key';
  }
  
  initDatabase(encryptionKey);
  registerIpcHandlers();
  
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
