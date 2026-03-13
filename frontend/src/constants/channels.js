/**
 * IPC 채널명 상수 (기능 보완)
 * preload/preload.js의 ALLOWED_CHANNELS와 반드시 일치해야 합니다.
 */
export const CHANNELS = {
  // TODO
  TODO_CREATE: 'todo:create',
  TODO_READ:   'todo:read',
  TODO_UPDATE: 'todo:update',
  TODO_DELETE: 'todo:delete',
  TODO_LIST:   'todo:list',

  // Schedule (달력 일정)
  SCHEDULE_CREATE: 'schedule:create',
  SCHEDULE_LIST:   'schedule:list',
  SCHEDULE_UPDATE: 'schedule:update',
  SCHEDULE_DELETE: 'schedule:delete',

  // Window 제어
  WINDOW_PIN:      'window:pin',
  WINDOW_UNPIN:    'window:unpin',
  WINDOW_MINIMIZE: 'window:minimize',
  WINDOW_CLOSE:    'window:close',
  WINDOW_OPACITY:  'window:set-opacity',

  SYNC_STATUS: 'todo:sync-status',
};
