/**
 * Preload 스크립트 (기능 보완)
 * - TODO, Schedule, Window 제어 채널 추가
 */
const { contextBridge, ipcRenderer } = require('electron');

const ALLOWED_CHANNELS = {
  invoke: [
    // TODO CRUD
    'todo:create', 'todo:read', 'todo:update', 'todo:delete', 'todo:list',
    // Schedule CRUD
    'schedule:create', 'schedule:list', 'schedule:update', 'schedule:delete',
    // Window 제어
    'window:pin', 'window:unpin', 'window:minimize', 'window:close', 'window:set-opacity',
  ],
  on: ['todo:sync-status']
};

contextBridge.exposeInMainWorld('secureAPI', {
  invoke: (channel, data) => {
    if (!ALLOWED_CHANNELS.invoke.includes(channel)) {
      return Promise.reject(new Error(`허용되지 않은 채널: ${channel}`));
    }
    return ipcRenderer.invoke(channel, data);
  },
  on: (channel, callback) => {
    if (!ALLOWED_CHANNELS.on.includes(channel)) {
      throw new Error(`허용되지 않은 채널: ${channel}`);
    }
    const safeCallback = (_event, ...args) => callback(...args);
    ipcRenderer.on(channel, safeCallback);
    return () => ipcRenderer.removeListener(channel, safeCallback);
  }
});
