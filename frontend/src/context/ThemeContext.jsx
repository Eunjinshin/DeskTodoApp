/**
 * 다크 모드 테마 컨텍스트
 *
 * [동작 원리]
 * - isDark 상태를 localStorage에 저장하여 새로고침 시에도 유지
 * - html 요소에 'dark' 클래스를 토글하여 Tailwind dark: 접두사 활성화
 * - body 배경색도 직접 변경하여 깜빡임 방지
 */
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // localStorage에서 테마 초기값 로드 (기본: light)
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem('weget-theme') === 'dark';
    } catch {
      return false;
    }
  });

  // 테마 변경 시 html에 dark 클래스 토글 + localStorage 저장
  useEffect(() => {
    const root = document.documentElement;

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    try {
      localStorage.setItem('weget-theme', isDark ? 'dark' : 'light');
    } catch {
      // localStorage 접근 불가 시 무시
    }
  }, [isDark]);

  /** 다크/라이트 토글 */
  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** 테마 컨텍스트 사용 Hook */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
