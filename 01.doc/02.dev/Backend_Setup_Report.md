# 백엔드 및 로컬 DB 환경 구축 리포트

## 1. 개요
Electron을 기반으로 한 WeGet TODO 애플리케이션의 Node.js 백엔드와 로컬 SQLite DB 계층 구축을 성공적으로 완료하였습니다.

## 2. 주요 구현 사항
1. **프로젝트 초기화 및 기본 환경 세팅 (`package.json`)**
   - `@journeyapps/sqlcipher`, `sqlite3`, `uuid` 라이브러리 설치.
   - `electron` 데브 디펜던시 설정.

2. **암호화된 로컬 데이터베이스 구성 (`database.js`)**
   - 사용자 투명성, 보안 요구사항(REQ-SEC-001)에 맞게 `PRAGMA key`를 이용한 SQLCipher 적용.
   - Todo 항목, Event 일정을 저장하기 위한 `todos`, `events` 테이블 자동 생성 로직 반영.

3. **IPC(Inter-Process Communication) 인터페이스 규격화 (`ipcHandlers.js`, `preload.js`)**
   - **보안 요구사항(REQ-SEC-002)** 반영: `nodeIntegration: false`, `contextIsolation: true`로 설정 후 `contextBridge` 를 통한 제한적 API 노출 (`preload.js`).
   - Todo 및 Event의 CRUD를 `ipcRenderer.invoke`를 통해 안전하게 수행할 수 있는 채널(`todo-get-all`, `todo-create` 등) 수립.
   - UI에서 요청된 복합 필터(이름, 날짜, 토글, 태그) 및 우선순위(상>중>하) 정렬 처리 쿼리 작성.

4. **프레임리스 윈도우 네이티브 제어 연동 (`windowEvents.js`)**
   - Always-on-top 핀 기능(`window-toggle-pin`), 반투명도 조절(`window-set-opacity`), 최소화 및 닫기 이벤트를 핸들링하는 로직 수립.

5. **애플리케이션 메인 엔트리(`main.js`) 완성**
   - DPAPI 활용을 위한 Electron native `safeStorage` (보안키 저장소) 가용성 확인 로직 스터브 추가.
   - 개발 환경(Vite React 기본 포트인 `http://localhost:5173`)과 프로덕션 환경 파일 로드 분기 적용.

## 3. 결과 및 검증 방법
- `02.backend` 폴더에서 `npm run dev` 시 암호화된 `weget-todo.db` 가 정상 생성됨을 확인.
- IPC API 브릿지가 `window.electronAPI` 객체를 통해 프론트엔드 환경에 오류 없이 노출되는 부분을 스캐폴딩 완료.

## 4. 특이사항 및 향후 계획
- 사용자의 프론트엔드 개발(03.frontend) 시 `window.electronAPI.getTodos()` 등을 선언된 그대로 호출하여 사용할 수 있으며, 프론트엔드 구성 환경으로 진입 예정.
