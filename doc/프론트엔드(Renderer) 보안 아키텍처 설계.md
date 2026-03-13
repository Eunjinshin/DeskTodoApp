# 프론트엔드(Renderer) 보안 아키텍처 설계

기존 백엔드(Main Process) + Preload의 보안 통신 계층 위에 React + Vite + Tailwind CSS 기반 프론트엔드를 구성합니다.

---

## 기술 스택

| 항목 | 기술 |
|------|------|
| UI Framework | React 18 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS v3 (안정 버전) |
| 상태 관리 | React Context + useReducer |
| 통신 | `window.secureAPI` (Preload Context Bridge) |

---

## 1. 보안 통신 계층 (Context Bridge 연동)

```
React Component → api/todoApi.js → window.secureAPI → IPC → Main → SQLCipher DB
```

- React 컴포넌트가 직접 `window.secureAPI`를 호출하지 않음
- `todoApi.js`에서 입력 정제(sanitize) 및 응답 검증 수행
- Main에서 온 데이터도 신뢰하지 않는 원칙 적용

---

## 2. 폴더 구조

```
frontend/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx           # React 엔트리
│   ├── App.jsx            # 메인 컴포넌트
│   ├── index.css          # Tailwind 지시문
│   ├── api/todoApi.js     # 보안 IPC 래퍼
│   ├── components/        # UI 컴포넌트
│   ├── hooks/useTodos.js  # CRUD 상태 관리
│   ├── context/           # React Context
│   ├── utils/sanitize.js  # XSS 방어
│   └── constants/         # 상수
```

---

## 3. 보안 전략

### XSS 방어
- `dangerouslySetInnerHTML` 사용 금지
- 입력 정제(sanitize) 유틸리티 적용
- CSP `script-src 'self'` (프로덕션)

### Injection 방어
- Preload 화이트리스트 + Backend validator
- Prototype Pollution 방지 (`Object.freeze`)

### 환경 분기
- 개발 모드: CSP 완화 (Vite dev server 허용)
- 프로덕션: 엄격한 CSP 유지
