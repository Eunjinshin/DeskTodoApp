/**
 * XSS 방어용 입력 정제(Sanitize) 유틸리티
 *
 * [XSS(Cross-Site Scripting) 공격이란?]
 * 공격자가 악성 스크립트를 입력값에 삽입하여
 * 다른 사용자의 브라우저에서 실행되게 하는 공격입니다.
 *
 * 예: 사용자가 TODO 제목에 "<script>alert('해킹')</script>"을 입력하면
 * 이 스크립트가 실행될 수 있습니다.
 *
 * [방어 원리]
 * HTML 특수 문자를 이스케이프하여 브라우저가 태그로 인식하지 못하게 합니다.
 * "<script>" → "&lt;script&gt;" (화면에 글자로 표시됨, 실행 안 됨)
 *
 * [참고] React는 기본적으로 JSX 내의 값을 이스케이프합니다.
 * 하지만 추가 보안 레이어로 입력 시점에서 정제하면 더 안전합니다.
 */

/** HTML 특수 문자 이스케이프 매핑 */
const ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
};

/**
 * HTML 특수 문자를 이스케이프합니다.
 * @param {string} str - 정제할 문자열
 * @returns {string} 이스케이프된 문자열
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"']/g, (char) => ESCAPE_MAP[char]);
}

/**
 * TODO 데이터에서 위험한 문자열을 정제합니다.
 *
 * [Prototype Pollution 방어]
 * Object.freeze()를 사용하여 반환 객체를 동결합니다.
 * 이렇게 하면 공격자가 __proto__ 등을 통해
 * 객체의 프로토타입을 오염시키는 것을 방지합니다.
 *
 * @param {Object} data - 정제할 TODO 데이터
 * @returns {Readonly<Object>} 정제 및 동결된 데이터
 */
export function sanitizeTodo(data) {
  if (!data || typeof data !== 'object') return Object.freeze({});

  const clean = {
    ...(data.id && { id: String(data.id) }),
    ...(data.title !== undefined && { title: escapeHtml(String(data.title)) }),
    ...(data.content !== undefined && { content: escapeHtml(String(data.content || '')) }),
    ...(data.priority !== undefined && { priority: Number(data.priority) || 0 }),
    ...(data.dueDate !== undefined && { dueDate: String(data.dueDate || '') }),
    ...(data.isDone !== undefined && { isDone: Boolean(data.isDone) }),
    ...(data.tag !== undefined && { tag: data.tag ? escapeHtml(String(data.tag).slice(0, 30)) : null }),
  };

  // 동결하여 변경 불가능하게 만듦 (Prototype Pollution 방어)
  return Object.freeze(clean);
}
