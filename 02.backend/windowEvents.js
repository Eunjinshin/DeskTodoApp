const { ipcMain } = require('electron');

function registerWindowEvents(mainWindow) {
  ipcMain.on('window-minimize', () => {
    if(mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.minimize();
    }
  });

  ipcMain.on('window-toggle-maximize', () => {
    if(mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    }
  });

  ipcMain.on('window-close', () => {
    if(mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.close();
    }
  });

  ipcMain.on('window-toggle-pin', (event, isPinned) => {
    if(mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.setAlwaysOnTop(isPinned);
    }
  });

  ipcMain.on('window-set-opacity', (event, opacity) => {
    if(mainWindow && !mainWindow.isDestroyed()) {
      // opacity should be between 0.3 and 1.0 (requirements: 30% ~ 100%)
      const safeOpacity = Math.max(0.3, Math.min(1.0, opacity));
      mainWindow.setOpacity(safeOpacity);
    }
  });
}

module.exports = {
  registerWindowEvents
};
