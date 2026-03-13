/**
 * HMAC-SHA256 기반 파일 무결성 검증 모듈
 * - 설정 파일 변조 감지
 * - Timing-Safe 비교로 타이밍 공격 방지
 */
const crypto = require('crypto');
const fs = require('fs');

/**
 * 파일의 HMAC-SHA256 해시 계산
 * @param {string} filePath - 대상 파일 경로
 * @param {Buffer|string} key - HMAC 키
 * @returns {string} hex 인코딩된 HMAC 값
 */
function calcFileHMAC(filePath, key) {
  const content = fs.readFileSync(filePath);
  return crypto.createHmac('sha256', key).update(content).digest('hex');
}

/**
 * 파일 무결성 검증
 * @param {string} filePath - 검증할 파일 경로
 * @param {string} expectedHMAC - 기대 HMAC 값 (hex)
 * @param {Buffer|string} key - HMAC 키
 * @returns {boolean} 무결성 검증 결과
 */
function verifyIntegrity(filePath, expectedHMAC, key) {
  try {
    const actual = calcFileHMAC(filePath, key);

    // Timing-Safe 비교 (타이밍 공격 방지)
    const actualBuf = Buffer.from(actual, 'hex');
    const expectedBuf = Buffer.from(expectedHMAC, 'hex');

    // 길이가 다르면 즉시 실패
    if (actualBuf.length !== expectedBuf.length) return false;

    return crypto.timingSafeEqual(actualBuf, expectedBuf);
  } catch {
    // 파일 없음 등 예외 시 실패 처리
    return false;
  }
}

module.exports = { calcFileHMAC, verifyIntegrity };
