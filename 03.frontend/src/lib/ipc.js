import { v4 as uuidv4 } from 'uuid';

const isElectron = typeof window !== 'undefined' && !!window.electronAPI;

// A simplistic mock implementation for in-browser development
class MockIPC {
  constructor() {
    this.todos = JSON.parse(localStorage.getItem('todos') || '[]');
    this.events = JSON.parse(localStorage.getItem('events') || '[]');
  }
  
  save() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
    localStorage.setItem('events', JSON.stringify(this.events));
  }

  async getTodos(filters) {
    let result = [...this.todos];
    if (filters?.date) {
      result = result.filter(t => t.due_date?.startsWith(filters.date));
    }
    if (filters?.tag) {
      result = result.filter(t => t.tags && t.tags.includes(filters.tag));
    }
    if (filters?.completed !== undefined) {
      const isCompleted = filters.completed ? 1 : 0;
      result = result.filter(t => t.completed === isCompleted);
    }
    result.sort((a, b) => {
      const pMap = { high: 1, medium: 2, low: 3 };
      const valA = pMap[a.priority] || 4;
      const valB = pMap[b.priority] || 4;
      if (valA !== valB) return valA - valB;
      if (a.due_date && b.due_date) return a.due_date.localeCompare(b.due_date);
      return 0;
    });
    return result;
  }

  async createTodo(todo) {
    const newTodo = { id: uuidv4(), completed: 0, created_at: new Date().toISOString(), ...todo };
    this.todos.push(newTodo);
    this.save();
    return newTodo;
  }

  async updateTodo(id, updates) {
    const idx = this.todos.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.todos[idx] = { ...this.todos[idx], ...updates, updated_at: new Date().toISOString() };
      this.save();
      return true;
    }
    return false;
  }

  async deleteTodo(id) {
    const len = this.todos.length;
    this.todos = this.todos.filter(t => t.id !== id);
    this.save();
    return this.todos.length !== len;
  }

  async getEvents(filters) {
    let result = [...this.events];
    if (filters?.month) {
      result = result.filter(e => e.start_date?.startsWith(filters.month));
    }
    return result.sort((a,b) => (a.start_date || '').localeCompare(b.start_date || ''));
  }

  async createEvent(ev) {
    const newEvent = { id: uuidv4(), created_at: new Date().toISOString(), ...ev };
    this.events.push(newEvent);
    this.save();
    return newEvent;
  }

  async updateEvent(id, updates) {
    const idx = this.events.findIndex(e => e.id === id);
    if (idx !== -1) {
      this.events[idx] = { ...this.events[idx], ...updates, updated_at: new Date().toISOString() };
      this.save();
      return true;
    }
    return false;
  }

  async deleteEvent(id) {
    const len = this.events.length;
    this.events = this.events.filter(e => e.id !== id);
    this.save();
    return this.events.length !== len;
  }
}

const mock = new MockIPC();

export const ipc = {
  getTodos: (filters) => isElectron ? window.electronAPI.getTodos(filters) : mock.getTodos(filters),
  createTodo: (todo) => isElectron ? window.electronAPI.createTodo(todo) : mock.createTodo(todo),
  updateTodo: (id, updates) => isElectron ? window.electronAPI.updateTodo(id, updates) : mock.updateTodo(id, updates),
  deleteTodo: (id) => isElectron ? window.electronAPI.deleteTodo(id) : mock.deleteTodo(id),
  
  getEvents: (filters) => isElectron ? window.electronAPI.getEvents(filters) : mock.getEvents(filters),
  createEvent: (ev) => isElectron ? window.electronAPI.createEvent(ev) : mock.createEvent(ev),
  updateEvent: (id, updates) => isElectron ? window.electronAPI.updateEvent(id, updates) : mock.updateEvent(id, updates),
  deleteEvent: (id) => isElectron ? window.electronAPI.deleteEvent(id) : mock.deleteEvent(id)
};
