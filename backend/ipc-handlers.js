/**
 * IPC 핸들러 모듈 (리팩토링)
 * - [P4] Window 핸들러 getWindow() 헬퍼 추출
 * - [P7] schedule:list 인자 정리
 */
const { ipcMain, BrowserWindow } = require('electron');
const { validate, isValidUUID } = require('./security/validator');
const queries = require('./db/queries');

/** 공통 try-catch 래퍼 */
function wrapHandler(name, handler) {
  return async (event, ...args) => {
    try {
      return await handler(event, ...args);
    } catch (err) {
      console.error(`[${name}] 에러:`, err.message);
      return { success: false, errors: [`${name} 처리에 실패했습니다.`] };
    }
  };
}

/** [P4] Window 참조 헬퍼 — 중복 제거 */
function getWindow(event) {
  return BrowserWindow.fromWebContents(event.sender);
}

function registerHandlers(db) {
  // ── TODO CRUD ──
  ipcMain.handle('todo:create', wrapHandler('todo:create', async (_e, data) => {
    const { valid, errors } = validate(data);
    if (!valid) return { success: false, errors };
    const todo = await queries.createTodo(db, data);
    return { success: true, data: todo };
  }));

  ipcMain.handle('todo:read', wrapHandler('todo:read', async (_e, id) => {
    if (!isValidUUID(id)) return { success: false, errors: ['유효하지 않은 ID입니다.'] };
    const todo = await queries.getTodo(db, id);
    if (!todo) return { success: false, errors: ['TODO를 찾을 수 없습니다.'] };
    return { success: true, data: todo };
  }));

  ipcMain.handle('todo:list', wrapHandler('todo:list', async () => {
    const todos = await queries.listTodos(db);
    return { success: true, data: todos };
  }));

  ipcMain.handle('todo:update', wrapHandler('todo:update', async (_e, data) => {
    if (!data || !isValidUUID(data.id)) return { success: false, errors: ['유효하지 않은 ID입니다.'] };
    const todo = await queries.updateTodo(db, data);
    if (!todo) return { success: false, errors: ['TODO를 찾을 수 없습니다.'] };
    return { success: true, data: todo };
  }));

  ipcMain.handle('todo:delete', wrapHandler('todo:delete', async (_e, id) => {
    if (!isValidUUID(id)) return { success: false, errors: ['유효하지 않은 ID입니다.'] };
    const ok = await queries.deleteTodo(db, id);
    if (!ok) return { success: false, errors: ['TODO를 찾을 수 없습니다.'] };
    return { success: true };
  }));

  // ── Schedule CRUD ──
  ipcMain.handle('schedule:create', wrapHandler('schedule:create', async (_e, data) => {
    if (!data?.title || !data?.startDate) {
      return { success: false, errors: ['제목과 시작일은 필수입니다.'] };
    }
    const schedule = await queries.createSchedule(db, data);
    return { success: true, data: schedule };
  }));

  // [P7] listSchedules는 인자 없이 호출
  ipcMain.handle('schedule:list', wrapHandler('schedule:list', async () => {
    const list = await queries.listSchedules(db);
    return { success: true, data: list };
  }));

  ipcMain.handle('schedule:update', wrapHandler('schedule:update', async (_e, data) => {
    if (!data || !isValidUUID(data.id)) return { success: false, errors: ['유효하지 않은 ID입니다.'] };
    const schedule = await queries.updateSchedule(db, data);
    if (!schedule) return { success: false, errors: ['일정을 찾을 수 없습니다.'] };
    return { success: true, data: schedule };
  }));

  ipcMain.handle('schedule:delete', wrapHandler('schedule:delete', async (_e, id) => {
    if (!isValidUUID(id)) return { success: false, errors: ['유효하지 않은 ID입니다.'] };
    const ok = await queries.deleteSchedule(db, id);
    if (!ok) return { success: false, errors: ['일정을 찾을 수 없습니다.'] };
    return { success: true };
  }));

  // ── Window 제어 ([P4] getWindow 헬퍼 사용) ──
  ipcMain.handle('window:pin', wrapHandler('window:pin', async (event) => {
    const win = getWindow(event);
    if (!win) return { success: false, errors: ['창을 찾을 수 없습니다.'] };
    win.setAlwaysOnTop(true);
    return { success: true, data: { pinned: true } };
  }));

  ipcMain.handle('window:unpin', wrapHandler('window:unpin', async (event) => {
    const win = getWindow(event);
    if (!win) return { success: false, errors: ['창을 찾을 수 없습니다.'] };
    win.setAlwaysOnTop(false);
    return { success: true, data: { pinned: false } };
  }));

  ipcMain.handle('window:minimize', wrapHandler('window:minimize', async (event) => {
    const win = getWindow(event);
    if (win) win.minimize();
    return { success: true };
  }));

  ipcMain.handle('window:close', wrapHandler('window:close', async (event) => {
    const win = getWindow(event);
    if (win) win.close();
    return { success: true };
  }));

  ipcMain.handle('window:set-opacity', wrapHandler('window:set-opacity', async (event, opacity) => {
    const win = getWindow(event);
    if (!win) return { success: false, errors: ['창을 찾을 수 없습니다.'] };
    const value = Math.max(0.3, Math.min(1, Number(opacity) || 1));
    win.setOpacity(value);
    return { success: true, data: { opacity: value } };
  }));
}

module.exports = { registerHandlers };
