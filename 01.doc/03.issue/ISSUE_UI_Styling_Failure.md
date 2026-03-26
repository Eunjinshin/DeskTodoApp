# ISSUE-20260326-001: UI 스타일 미적용 및 윈도우 렌더링 오류

## 1. 분석 (Analysis)
- 애플리케이션 실행 시, 프레임리스 윈도우 내의 콘텐츠가 스타일(Tailwind CSS)이 적용되지 않은 상태로 렌더링됨.
- 배경이 투명하게 처리되어 식별이 어렵고, 레이아웃이 깨져서 나타남.
- `03.frontend` 내의 React 컴포넌트 로직은 정상 작동하나, CSS 번들링 및 적용 과정에서 문제가 발생함.

## 2. 원인 (Cause)
1. **Tailwind CSS 버전 불일치**: `package.json`에 `tailwindcss` v4.x 버전이 설치되었으나, 구성 파일(`tailwind.config.js`, `postcss.config.js`)은 v3.x 방식으로 작성되어 Vite 엔진이 스타일을 올바르게 처리하지 못함.
2. **포트 미스매칭 가능성**: Vite 개발 서버가 5173 포트가 아닌 다른 포트(5176 등)에서 실행 중일 때, Electron의 `main.js`가 하드코딩된 5173 포트를 로드하여 스타일이 누락되거나 다른 리소스가 로드될 수 있음.

## 3. 수정 방향 (Resolution Plan)
1. **Tailwind CSS 버전 다운그레이드**: 가장 안정적인 v3.x 버전(`tailwindcss@3.4.1`)으로 명시적 설치를 진행하여 현재의 설정 파일들과 호환성을 확보함.
2. **PostCSS 구성 재확인**: `@tailwindcss/postcss` 플러그인을 사용하여 Vite가 일반적인 CSS 처리 파이프라인에서 Tailwind를 인식하도록 교정.
3. **Vite 포트 고정**: `vite.config.js`에서 포트를 5173으로 명시적으로 고정하여 Electron과 통신 상의 혼선을 방지함.
4. **App Layout 보정**: 메인 레이아웃 클래스(`w-full h-full`)가 누락되지 않도록 재점검.
