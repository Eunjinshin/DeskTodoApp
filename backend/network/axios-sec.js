/**
 * 보안 강화 Axios 인스턴스 모듈
 * - SSL/TLS Pinning (인증서 고정)
 * - TLS 1.2 이상 강제
 * - 타임아웃 및 리다이렉트 제한
 * - 요청/응답 인터셉터 (로깅, 에러 핸들링)
 */
const axios = require('axios');
const https = require('https');
const fs = require('fs');

/**
 * 보안 강화 Axios 인스턴스 생성
 * @param {Object} options
 * @param {string} [options.certPath] - SSL Pinning용 CA 인증서 경로
 * @param {number} [options.timeout=10000] - 요청 타임아웃 (ms)
 * @param {number} [options.maxRedirects=3] - 최대 리다이렉트 수
 * @returns {import('axios').AxiosInstance}
 */
function createSecureAxios(options = {}) {
  const {
    certPath,
    timeout = 10000,
    maxRedirects = 3
  } = options;

  // ── SSL Pinning용 인증서 로드 ──
  const pinnedCert = certPath && fs.existsSync(certPath)
    ? fs.readFileSync(certPath)
    : undefined;

  // ── HTTPS Agent 설정 ──
  const httpsAgent = new https.Agent({
    ca: pinnedCert,              // 고정할 CA 인증서
    rejectUnauthorized: true,    // 자체 서명 인증서 거부
    minVersion: 'TLSv1.2',      // TLS 1.2 이상 강제
    maxVersion: 'TLSv1.3',      // TLS 1.3까지 허용
  });

  // ── Axios 인스턴스 생성 ──
  const instance = axios.create({
    timeout,
    maxRedirects,
    httpsAgent,
    headers: {
      'Content-Type': 'application/json',
      'X-Content-Type-Options': 'nosniff',
      'Accept': 'application/json',
    },
    // 응답 크기 제한 (10MB)
    maxContentLength: 10 * 1024 * 1024,
    maxBodyLength: 10 * 1024 * 1024,
  });

  // ── 요청 인터셉터 ──
  instance.interceptors.request.use(
    (config) => {
      // 민감 헤더 로깅 마스킹
      const safeHeaders = { ...config.headers };
      if (safeHeaders.Authorization) {
        safeHeaders.Authorization = '***MASKED***';
      }
      console.log(`[HTTP] ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => Promise.reject(error)
  );

  // ── 응답 인터셉터 ──
  instance.interceptors.response.use(
    (response) => {
      console.log(`[HTTP] ${response.status} ${response.config.url}`);
      return response;
    },
    (error) => {
      // 인증서 관련 에러 감지
      const certErrors = [
        'CERT_HAS_EXPIRED',
        'ERR_TLS_CERT_ALTNAME_INVALID',
        'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
        'SELF_SIGNED_CERT_IN_CHAIN'
      ];

      if (certErrors.includes(error.code)) {
        console.error(`[보안 경고] SSL 인증서 문제 감지: ${error.code}`);
      }

      return Promise.reject(error);
    }
  );

  return instance;
}

module.exports = { createSecureAxios };
