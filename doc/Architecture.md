# 백엔드 아키텍처 설계

보안 가이드라인이 준수된 Electron 기반 데스크톱 TODO 앱의 Main Process 환경 구성 및 초기 아키텍처를 설계합니다.

> [!IMPORTANT]
> 이 프로젝트는 **보안 최우선** 원칙으로 설계됩니다. SQLCipher를 통해 DB 전체 암호화(단일 레이어)가 적용됩니다.

---

## 기술 스택

| 항목 | 기술 | 버전 |
|------|------|------|
| Runtime | Electron (Main Process) | v28+ |
| Node.js | Node.js | v18+ |
| Database | SQLite + SQLCipher (`@journeyapps/sqlcipher`) | 최신 |
| 암호화 | SQLCipher 단일 레이어 (DB 전체 암호화) | 내장 |
| HTTP Client | Axios | 최신 |
| 빌드 | Docker | 최신 |
| 런타임 관리 | nvm | 최신 |

---

## 1. 프로젝트 디렉토리 구조

```
02.weget/
├── .nvmrc
├── .dockerignore
├── Dockerfile
├── package.json
├── electron-builder.yml
│
├── backend/                  # Main Process (Main, IPC, DB)
│   ├── index.js              # 앱 엔트리포인트
│   ├── window.js             # BrowserWindow 생성
│   ├── ipc-handlers.js       # IPC 핸들러
│   ├── db/                   # DB 서비스 및 쿼리
│   ├── security/             # 보안 모듈 (key-mgr, validator 등)
│   └── network/              # 네트워크 모듈 (axios-sec)
│
├── preload/                  # Context Bridge 설정
│   └── preload.js
│
├── frontend/                 # Renderer Process (UI)
│   └── index.html
│
├── doc/                      # 문서
│   ├── Architecture.md
│   └── Security_Checklist.md
│
└── certs/                    # SSL 인증서
```

---

## 2. Preload 스크립트 보안 설계 원칙

### 핵심 원칙

1. **Context Isolation 필수 활성화**: `contextIsolation: true`
2. **Node Integration 비활성화**: `nodeIntegration: false`
3. **최소 권한 원칙 (Least Privilege)**: 필요한 API만 `contextBridge`로 노출
4. **채널명 네임스페이스**: `todo:` 접두사 사용
5. **입력값 검증**: Preload에서 1차 타입 검증 권장

---

## 3. DB 스키마 및 SQLCipher 암호화

### SQLCipher 초기화

`@journeyapps/sqlcipher`를 사용하여 DB 전체를 암호화합니다. 마스터 키는 `key-mgr.js`를 통해 안전하게 관리됩니다.

### DB 스키마 (SQLCipher 단일 레이어)

- **todos**: ID, 제목, 내용, 상태, 우선순위, 마감일 등 저장
- **audit_log**: 데이터 변경 이력 추적
- **app_config**: 앱 설정값 저장

> [!NOTE]
> SQLCipher 단일 레이어 암호화를 적용합니다. DB 파일 전체가 암호화되므로 필드 레벨 암호화는 사용하지 않습니다.

---

## 4. 보안 모듈 및 네트워크

- **Key Manager**: `safeStorage`를 사용하여 OS 수준에서 암호화 키 보호
- **Validator**: IPC 통신으로 들어오는 모든 데이터의 타입 및 SQL 인젝션 패턴 검증
- **Integrity**: 중요 파일에 대한 HMAC 기반 무결성 체크
- **Secure Axios**: SSL Pinning 및 TLS 1.2+ 강제로 중간자 공격 방지

---

## 5. 검증 계획

### 자동 테스트
1. **DB 초기화 및 CRUD 테스트** — SQLCipher 생성 및 데이터 입출력 검증
2. **입력값 검증 테스트** — SQL 인젝션 패턴 차단 및 타입 검증

### 수동 검증
1. **Electron 보안 설정 확인** — `contextIsolation`, `sandbox` 활성화 여부 및 Node API 노출 여부 점검
2. **DB 파일 암호화 확인** — 외부 SQLite 툴로 DB 파일 열기 시도 시 차단 확인
