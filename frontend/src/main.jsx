/**
 * React 엔트리포인트
 *
 * [StrictMode란?]
 * 개발 모드에서 잠재적 문제를 감지해주는 React 기능입니다.
 * - 의도치 않은 부수 효과를 발견합니다.
 * - 프로덕션 빌드에서는 자동으로 비활성화됩니다 (성능 영향 없음).
 *
 * [TodoProvider]
 * 전역 상태(Context)를 앱 전체에 제공합니다.
 * 이 Provider 안에 있는 모든 컴포넌트가 useTodoContext()로 상태에 접근 가능합니다.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TodoProvider } from './context/TodoContext.jsx';
import App from './App.jsx';

// Tailwind CSS 글로벌 스타일 로드
import './index.css';

// React 앱을 #root 엘리먼트에 마운트
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TodoProvider>
      <App />
    </TodoProvider>
  </StrictMode>,
);
