/**
 * 보안 IPC 통신 래퍼 (API Layer)
 *
 * [아키텍처 설명]
 * React 컴포넌트 → todoApi.js → window.secureAPI → Preload → IPC → Main Process → DB
 *
 * [왜 직접 window.secureAPI를 호출하지 않나?]
 * 1. 입력 정제(sanitize)를 한 곳에서 처리하여 누락을 방지합니다.
 * 2. 응답 데이터를 검증하여 Main Process에서 온 데이터도 신뢰하지 않습니다.
 * 3. 에러 처리를 통일하여 내부 에러 메시지가 사용자에게 노출되지 않게 합니다.
 * 4. 나중에 오프라인 캐시 등을 추가할 때 이 레이어만 수정하면 됩니다.
 *
 * [window.secureAPI란?]
 * Preload 스크립트(preload/preload.js)가 contextBridge로 노출한 안전한 API입니다.
 * - invoke(channel, data): Main에 요청 후 응답을 기다립니다.
 * - on(channel, callback): Main에서 보내는 이벤트를 구독합니다.
 */
import { CHANNELS } from '../constants/channels';
import { sanitizeTodo } from '../utils/sanitize';
import { getAPI } from './base';

/**
 * TODO 생성
 * @param {{ title: string, content?: string, priority?: number, dueDate?: string }} data
 * @returns {Promise<Object>} 생성된 TODO
 */
export async function createTodo(data) {
  const api = getAPI();
  // 입력 데이터 정제 (XSS 방어)
  const clean = sanitizeTodo(data);
  const result = await api.invoke(CHANNELS.TODO_CREATE, clean);

  // 응답 검증: Main에서 온 데이터도 신뢰하지 않음
  if (!result.success) {
    throw new Error(result.errors?.[0] || 'TODO 생성에 실패했습니다.');
  }
  return result.data;
}

/**
 * TODO 단건 조회
 * @param {string} id - TODO ID (UUID)
 * @returns {Promise<Object>}
 */
export async function readTodo(id) {
  const api = getAPI();
  const result = await api.invoke(CHANNELS.TODO_READ, id);

  if (!result.success) {
    throw new Error(result.errors?.[0] || 'TODO 조회에 실패했습니다.');
  }
  return result.data;
}

/**
 * TODO 목록 조회
 * @returns {Promise<Array>}
 */
export async function listTodos() {
  const api = getAPI();
  const result = await api.invoke(CHANNELS.TODO_LIST);

  if (!result.success) {
    throw new Error(result.errors?.[0] || 'TODO 목록 조회에 실패했습니다.');
  }
  // 배열 타입 검증
  return Array.isArray(result.data) ? result.data : [];
}

/**
 * TODO 수정
 * @param {{ id: string, title?: string, content?: string, isDone?: boolean, priority?: number, dueDate?: string }} data
 * @returns {Promise<Object>} 수정된 TODO
 */
export async function updateTodo(data) {
  const api = getAPI();
  const clean = sanitizeTodo(data);
  const result = await api.invoke(CHANNELS.TODO_UPDATE, clean);

  if (!result.success) {
    throw new Error(result.errors?.[0] || 'TODO 수정에 실패했습니다.');
  }
  return result.data;
}

/**
 * TODO 삭제
 * @param {string} id - TODO ID (UUID)
 * @returns {Promise<boolean>}
 */
export async function deleteTodo(id) {
  const api = getAPI();
  const result = await api.invoke(CHANNELS.TODO_DELETE, id);

  if (!result.success) {
    throw new Error(result.errors?.[0] || 'TODO 삭제에 실패했습니다.');
  }
  return true;
}
