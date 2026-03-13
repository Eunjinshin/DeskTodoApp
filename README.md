# 📝 WeGet TODO

**보안 강화 Electron 기반 데스크톱 TODO 애플리케이션**

WeGet TODO는 개인의 할 일과 일정을 안전하게 관리할 수 있도록 설계된 데스크톱 애플리케이션입니다. 강력한 보안 아키텍처를 기반으로 하며, 사용자 친화적인 UI와 다양한 편의 기능을 제공합니다.

---

## ✨ 핵심 기능

### 1. TODO 관리
- **스마트 등록**: 제목, 내용, 우선순위, 마감일, 태그를 한 번에 관리합니다.
- **우선순위 자동 정렬**: 상(🔴), 중(🟡), 하(⚪) 등급에 따라 중요한 일이 목록 상단에 먼저 표시됩니다.
- **날짜별 필터**: 특정 날짜를 선택하여 필터링하거나 전체 목록을 한눈에 볼 수 있습니다.
- **태그 시스템**: `#` 태그를 활용한 카테고리화가 가능합니다.

### 2. 달력 및 일정 관리
- **Windows 스타일 뷰**: 익숙하고 깔끔한 Segoe UI 기반의 달력 인터페이스를 제공합니다.
- **유연한 반복 설정**: 당일, 매일, 매주, 매달, 매년 반복되는 일정을 손쉽게 등록하세요.
- **상세 내용 보기**: 일정 제목을 클릭하여 상세 내용을 접고 펼칠 수 있습니다.

### 3. 창 제어 및 UX
- **프레임리스 디자인**: 불필요한 테두리를 없애고 커스텀 타이틀바를 통해 세련된 디자인을 제공합니다.
- **Always-on-Top (핀 기능)**: 다른 창 위에 항상 고정하여 중요한 정보를 놓치지 마세요.
- **투명도 조절**: 필요에 따라 창의 투명도를 30%에서 100%까지 자유롭게 조절할 수 있습니다.
- **반응형 UI**: 창 크기에 맞춰 레이아웃이 유연하게 변화합니다.

---

## 🔒 보안 아키텍처 (Security First)

본 프로젝트는 데이터 보호와 안정성을 최우선으로 설계되었습니다.

- **DB 전체 암호화**: `SQLCipher`를 사용하여 데이터베이스 파일 자체를 암호화합니다. 마스터 키는 시스템 수준의 안전한 저장소(DPAPI/Keychain)를 통해 관리됩니다.
- **강력한 IPC 보안**: `Context Isolation`과 `Context Bridge`를 통해 렌더러 프로세스와 메인 프로세스를 철저히 분리하며, 화이트리스트 기반의 검증된 채널만 사용합니다.
- **XSS 차단**: React의 자동 이스케이프 기능과 별도의 `sanitize.js` 유틸리티를 통해 인젝션 공격을 원천 차단합니다.
- **네트워크 보안**: CSP(Content Security Policy) 적용 및 SSL Pinning을 통해 안전한 통신을 보장합니다.

---

## 🛠 기술 스택

- **Runtime**: Electron v28+
- **Frontend**: React 18, Vite 5, Tailwind CSS v3
- **Backend**: Node.js v18+
- **Database**: SQLite + SQLCipher
- **UI Components**: react-calendar

---

## 🚀 시작하기

### 개발 환경 설정
```bash
# 의존성 설치
npm install

# 프론트엔드 개발 서버 실행
npm run dev:renderer

# Electron 앱 실행 (루트 디렉토리에서)
npm start
```

### 빌드 및 패키징
```bash
npm run build
```

---

## 📁 프로젝트 구조
```bash
02.weget/
├── backend/            # Main Process (DB, IPC, 보안 로직)
├── frontend/           # Renderer Process (React, Tailwind UI)
├── preload/            # Context Bridge (통찰력 있는 통신 통로)
├── doc/                # 설계 및 기능 명세서
└── certs/              # 무결성 검증용 인증서
```

---

## 📄 라이선스
MIT License

---
**Author**: [Eunjinshin](https://github.com/Eunjinshin)
**Repository**: [DeskTodoApp](https://github.com/Eunjinshin/DeskTodoApp)
