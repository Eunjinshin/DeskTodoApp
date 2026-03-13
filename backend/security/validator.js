/**
 * 입력값 검증 유틸리티 (리팩토링)
 * - [P5] SQL 키워드 패턴 제거 (Prepared Statement에 의존)
 * - [P9] tag 필드 검증 추가
 */

/**
 * TODO 데이터 검증 스키마
 */
const TODO_SCHEMA = {
  title: {
    type: 'string',
    maxLen: 200,
    required: true,
    message: '제목은 필수이며 200자 이내여야 합니다.'
  },
  content: {
    type: 'string',
    maxLen: 5000,
    required: false,
    message: '내용은 5000자 이내여야 합니다.'
  },
  // [P9] tag 필드 추가
  tag: {
    type: 'string',
    maxLen: 30,
    required: false,
    message: '태그는 30자 이내여야 합니다.'
  },
  priority: {
    type: 'number',
    min: 0,
    max: 2,
    required: false,
    message: '우선순위는 0(하), 1(중), 2(상) 중 하나여야 합니다.'
  },
  dueDate: {
    type: 'string',
    pattern: /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?$/,
    required: false,
    message: '마감일은 YYYY-MM-DD 형식이어야 합니다.'
  },
  isDone: {
    type: 'boolean',
    required: false,
    message: '완료 여부는 true/false여야 합니다.'
  }
};

/**
 * 스키마 기반 데이터 검증
 * [P5] SQL Injection 패턴 검사 제거 — Prepared Statement에 의존
 */
function validate(data, schema = TODO_SCHEMA) {
  const errors = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['데이터가 유효하지 않습니다.'] };
  }

  for (const [field, rule] of Object.entries(schema)) {
    const value = data[field];

    // 필수 필드 검증
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push(rule.message);
      continue;
    }

    if (value === undefined || value === null) continue;

    // 타입 검증
    if (typeof value !== rule.type) {
      errors.push(`${field}: 타입이 올바르지 않습니다. (기대: ${rule.type})`);
      continue;
    }

    // 문자열 길이 검증
    if (rule.type === 'string' && rule.maxLen && value.length > rule.maxLen) {
      errors.push(rule.message);
    }

    // 숫자 범위 검증
    if (rule.type === 'number') {
      if (rule.min !== undefined && value < rule.min) errors.push(rule.message);
      if (rule.max !== undefined && value > rule.max) errors.push(rule.message);
    }

    // 패턴 검증
    if (rule.pattern && !rule.pattern.test(value)) {
      errors.push(rule.message);
    }
  }

  return { valid: errors.length === 0, errors };
}

/** UUID v4 형식 검증 */
function isValidUUID(id) {
  if (typeof id !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

module.exports = { validate, isValidUUID, TODO_SCHEMA };
