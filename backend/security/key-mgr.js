/**
 * 키 관리 모듈
 * - Electron safeStorage API로 OS 수준 보호 (Windows: DPAPI)
 * - 마스터 키 생성/로드/저장
 */
const { safeStorage } = require('electron');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/** 키 파일명 */
const KEY_FILE = '.weget-key';

class KeyManager {
  /**
   * 마스터 키 조회 또는 신규 생성
   * - safeStorage 사용 가능: OS 수준 암호화로 키 보호
   * - safeStorage 미지원: 랜덤 키를 파일로 저장 (폴백)
   * @param {string} userDataPath - app.getPath('userData') 경로
   * @returns {Promise<string>} passphrase 문자열
   */
  static async getOrCreateKey(userDataPath) {
    const keyPath = path.join(userDataPath, KEY_FILE);

    // 기존 키가 있으면 로드
    if (fs.existsSync(keyPath)) {
      return KeyManager._loadKey(keyPath);
    }

    // 신규 키 생성 (64바이트 랜덤 → hex 문자열)
    const rawKey = crypto.randomBytes(64).toString('hex');

    // 키 저장
    KeyManager._saveKey(keyPath, rawKey);

    return rawKey;
  }

  /**
   * 키 저장
   * @param {string} keyPath - 키 파일 경로
   * @param {string} rawKey - 평문 키
   */
  static _saveKey(keyPath, rawKey) {
    if (safeStorage.isEncryptionAvailable()) {
      // OS 수준 암호화로 보호 (DPAPI/Keychain/libsecret)
      const encrypted = safeStorage.encryptString(rawKey);
      fs.writeFileSync(keyPath, encrypted);
    } else {
      // 폴백: 평문 저장 (경고 로그)
      console.warn('[보안 경고] safeStorage 미지원. 키가 평문으로 저장됩니다.');
      fs.writeFileSync(keyPath, rawKey, 'utf8');
    }
  }

  /**
   * 키 로드
   * @param {string} keyPath - 키 파일 경로
   * @returns {string} 복호화된 키
   */
  static _loadKey(keyPath) {
    if (safeStorage.isEncryptionAvailable()) {
      // OS 수준 복호화
      const encrypted = fs.readFileSync(keyPath);
      return safeStorage.decryptString(encrypted);
    } else {
      // 폴백: 평문 읽기
      return fs.readFileSync(keyPath, 'utf8');
    }
  }
}

module.exports = { KeyManager };
