/**
 * Window 컨텍스트 컴포넌트
 * - 앱 전반의 윈도우 관련된 상태(화면 고정 등)를 관리합니다.
 */
import React, { createContext, useContext, useState } from 'react';
import { pinWindow, unpinWindow } from '../api/windowApi';

const WindowContext = createContext();

export function WindowProvider({ children }) {
  const [isPinned, setIsPinned] = useState(false);

  /** 핀 토글 로직: 메인 프로세스의 Electron API와 연동하며 상태 업데이트 */
  const togglePin = async () => {
    try {
      if (isPinned) {
        await unpinWindow();
      } else {
        await pinWindow();
      }
      setIsPinned(!isPinned);
    } catch (err) {
      console.error('핀 토글 실패:', err);
    }
  };

  return (
    <WindowContext.Provider value={{ isPinned, togglePin }}>
      {children}
    </WindowContext.Provider>
  );
}

/** 하위 컴포넌트에서 쉽게 WindowContext를 접근하기 위한 커스텀 훅 */
export function useWindow() {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindow must be used within a WindowProvider');
  }
  return context;
}
