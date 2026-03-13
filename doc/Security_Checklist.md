# Security Checklist

로컬 환경의 보안 위협을 최소화하기 위한 보안 체크리스트입니다.

## 1. 메모리 보안 (Memory Security)
- [ ] 민감 데이터(암호, 키 등) 사용 후 즉시 `Buffer.fill(0)`으로 초기화
- [ ] 힙 스냅샷 유출 방지를 위한 민감 데이터의 문자열 변환 최소화
- [ ] 프로덕션 빌드에서 DevTools 비활성화 (`window.js` 구현 완료)

## 2. 파일 시스템 보안 (File System Security)
- [ ] SQLCipher를 이용한 데이터베이스 파일(SQLite) 전체 암호화 (`backend/db/init.js` 구현 완료)
- [ ] 설정 파일 및 데이터 파일에 대한 HMAC 기반 무결성 검증 (`backend/security/integrity.js` 구현 완료)
- [ ] 로그 파일에 민감 정보(개인식별정보, 비밀번호 등) 기록 금지
- [ ] 앱 종료 시 임시 파일 및 캐시 자동 삭제 로직 확인

## 3. 프로세스 간 통신 (IPC) 보안
- [ ] `contextIsolation: true` 및 `nodeIntegration: false` 활성화 (`backend/window.js` 구현 완료)
- [ ] Preload 스크립트에서 화이트리스트 기반 IPC 채널만 노출 (`preload/preload.js` 구현 완료)
- [ ] IPC로 수신되는 모든 데이터에 대한 타입/길이/형식 검증 (`backend/security/validator.js` 구현 완료)
- [ ] `event.sender` 검증 및 `remote` 모듈 사용 금지

## 4. 네트워크 보안 (Network Security)
- [ ] SSL/TLS Pinning 적용 (지정된 CA 인증서만 신뢰) (`backend/network/axios-sec.js` 구현 완료)
- [ ] 최소 TLS 1.2 버전 이상 사용 강제
- [ ] 외부 URL 네비게이션 및 새 창 열기 차단 (`backend/index.js` 구현 완료)
- [ ] 강력한 Content Security Policy (CSP) 설정

## 5. 앱 레벨 보안 (Application Level)
- [ ] 빌드된 asar 파일 변조 방지를 위한 코드 서명(Code Signing) 적용
- [ ] 마스터 키 보호를 위한 OS 보안 저장소(safeStorage) 활용 (`backend/security/key-mgr.js` 구현 완료)
- [ ] 오픈소스 의존성 취약점 주기적 점검 (`npm audit`)
- [ ] 프로토콜 핸들러 악용 방지를 위한 커스텀 프로토콜 검증
