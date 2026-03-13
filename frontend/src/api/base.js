/**
 * IPC 통신 공통 베이스 (리팩토링)
 * [P8] todoApi, scheduleApi, windowApi에서 중복되던 getAPI() 통합
 */

/**
 * Electron secureAPI 존재 여부 확인
 * 브라우저 환경에서는 window.secureAPI가 없으므로 에러를 던짐
 */
export function getAPI() {
  if (!window.secureAPI) {
    throw new Error('secureAPI를 사용할 수 없습니다. Electron 환경에서 실행해주세요.');
  }
  return window.secureAPI;
}
