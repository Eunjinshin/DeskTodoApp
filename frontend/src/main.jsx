/**
 * React 엔트리포인트
 *
 * [StrictMode란?]
 * 개발 모드에서 잠재적 문제를 감지해주는 React 기능입니다.
 *
 * [ThemeProvider]
 * 다크/라이트 테마를 전역적으로 관리합니다.
 *
 * [TodoProvider]
 * 전역 상태(Context)를 앱 전체에 제공합니다.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { TodoProvider } from './context/TodoContext.jsx';
import App from './App.jsx';

// Tailwind CSS 글로벌 스타일 로드
import './index.css';

// React 앱을 #root 엘리먼트에 마운트
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <TodoProvider>
        <App />
      </TodoProvider>
    </ThemeProvider>
  </StrictMode>,
);
