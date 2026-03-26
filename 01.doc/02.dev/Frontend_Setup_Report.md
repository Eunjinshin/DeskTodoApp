# 프론트엔드 기본 환경 및 UI 테마 구성 리포트

## 1. 개요
WeGet TODO 애플리케이션의 데스크톱 화면을 담당할 React 18 기반 프론트엔드 기본 스캐폴딩 및 메인 레이아웃 환경 구성을 성공적으로 완료하였습니다.

## 2. 주요 구현 사항
1. **React, Vite, Tailwind CSS 연동 (`03.frontend`)**
   - 개발 생산성 향상을 위한 Vite 번들러 환경 구축 완료.
   - `tailwind.config.js`를 이용한 파스텔 핑크(`bg-pink-50`)와 크림(`bg-[#fdf8fa]`) 계열의 `pastel` 메인 테마 적용.
   - 다크 모드(`bg-slate-900`) 지원을 위한 글로벌 CSS(`@layer base`) 클래스 설계.

2. **데스크톱 프레임리스 윈도우 UI (`TitleBar.jsx`)**
   - 기본 운영체제 창틀을 없애고(Electron `frame: false`), 커스텀된 상단 타이틀바(`TitleBar`)를 배치하여 미려한 UI 보장.
   - 윈도우 드래그 가능 영역(`-webkit-app-region: drag;`) 적용 완료 및 드래그 불가 구역(버튼)의 맵핑을 구현함.
   - 백엔드 IPC 채널과 연동하여 `최소화`, `창모드 토글`, `닫기` 기능과 최상위 `Always-on-Top` 고정 핀 기능을 연결함.

3. **설정(Settings) 탭 별도 구성 (`Settings.jsx`)**
   - 사용자 설정에서 다크 모드와 라이트 모드를 토글할 수 있는 스위치 버튼 생성.
   - 창 투명도(Opacity)를 30% ~ 100% 구간으로 제어할 수 있는 슬라이더 생성 및 Electron IPC 호출(`window.electronAPI.setOpacity()`) 연결.

4. **메인 앱 레이아웃 통일 (`App.jsx`)**
   - 좌측에 탭 내비게이션 바(TODO, CALENDAR, SETTINGS 아이콘)를 배치함으로써 한 뷰포트 내에서 주요 서비스를 SPA(단일 페이지 애플리케이션) 형태로 끊김 없이 전환 가능하도록 구현.

## 3. 결과 및 검증 방법
- `npm run dev` 를 통해 `http://localhost:5173` 에서 정상적으로 UI가 렌더링 됨을 검증.
- 핀(Pin) 고정, 다크/라이트 모드, 투명도 조절 관련 상태 변경이 즉각적으로 UI에 반영됨 (`isPinned`, `theme`, `opacity` 상태 변수 정상 동작).

## 4. 향후 계획
- 다음 단계(Phase 3)에서는 TODO 관리 기능 화면을 본격적으로 개발할 예정입니다.
  - 리스트 뷰 및 정렬 기능, 신규 등록·수정·삭제 인터페이스를 렌더링합니다.
