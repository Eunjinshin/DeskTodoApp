/**
 * 보안 Schedule API 래퍼
 * todoApi.js와 동일한 구조로 입력 정제 및 응답 검증
 */
import { CHANNELS } from '../constants/channels';
import { escapeHtml } from '../utils/sanitize';
import { getAPI } from './base';

/** 일정 데이터 정제 */
function sanitizeSchedule(data) {
  if (!data || typeof data !== 'object') return {};
  return Object.freeze({
    ...(data.id && { id: String(data.id) }),
    ...(data.title !== undefined && { title: escapeHtml(String(data.title)) }),
    ...(data.content !== undefined && { content: escapeHtml(String(data.content || '')) }),
    ...(data.startDate && { startDate: String(data.startDate) }),
    ...(data.endDate !== undefined && { endDate: data.endDate ? String(data.endDate) : null }),
    ...(data.color && { color: String(data.color) }),
    ...(data.recurrence && { recurrence: String(data.recurrence) }),
  });
}

export async function createSchedule(data) {
  const api = getAPI();
  const clean = sanitizeSchedule(data);
  const result = await api.invoke(CHANNELS.SCHEDULE_CREATE, clean);
  if (!result.success) throw new Error(result.errors?.[0] || '일정 생성 실패');
  return result.data;
}

export async function listSchedules(startDate, endDate) {
  const api = getAPI();
  const result = await api.invoke(CHANNELS.SCHEDULE_LIST, { startDate, endDate });
  if (!result.success) throw new Error(result.errors?.[0] || '일정 목록 조회 실패');
  return Array.isArray(result.data) ? result.data : [];
}

export async function updateSchedule(data) {
  const api = getAPI();
  const clean = sanitizeSchedule(data);
  const result = await api.invoke(CHANNELS.SCHEDULE_UPDATE, clean);
  if (!result.success) throw new Error(result.errors?.[0] || '일정 수정 실패');
  return result.data;
}

export async function deleteSchedule(id) {
  const api = getAPI();
  const result = await api.invoke(CHANNELS.SCHEDULE_DELETE, id);
  if (!result.success) throw new Error(result.errors?.[0] || '일정 삭제 실패');
  return true;
}
