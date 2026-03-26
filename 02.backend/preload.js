const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Window Control
  minimize: () => ipcRenderer.send('window-minimize'),
  toggleMaximize: () => ipcRenderer.send('window-toggle-maximize'),
  close: () => ipcRenderer.send('window-close'),
  togglePin: (isPinned) => ipcRenderer.send('window-toggle-pin', isPinned),
  setOpacity: (opacity) => ipcRenderer.send('window-set-opacity', opacity),

  // TODO API
  getTodos: (filters) => ipcRenderer.invoke('todo-get-all', filters),
  createTodo: (todo) => ipcRenderer.invoke('todo-create', todo),
  updateTodo: (id, updates) => ipcRenderer.invoke('todo-update', id, updates),
  deleteTodo: (id) => ipcRenderer.invoke('todo-delete', id),

  // Event API
  getEvents: (filters) => ipcRenderer.invoke('event-get-all', filters),
  createEvent: (ev) => ipcRenderer.invoke('event-create', ev),
  updateEvent: (id, updates) => ipcRenderer.invoke('event-update', id, updates),
  deleteEvent: (id) => ipcRenderer.invoke('event-delete', id)
});
