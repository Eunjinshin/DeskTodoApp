/**
 * 커스텀 타이틀바 컴포넌트 (다크 모드 토글 포함)
 *
 * [타이틀바 구조]
 * 좌: 앱 제목 | 우: 다크모드 토글 + 핀 + 최소화 + 닫기
 */
import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { pinWindow, unpinWindow, minimizeWindow, closeWindow } from '../../api/windowApi';

export default function TitleBar() {
  const [pinned, setPinned] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  /** 핀 토글 */
  const handlePin = async () => {
    try {
      if (pinned) await unpinWindow();
      else await pinWindow();
      setPinned(!pinned);
    } catch (err) {
      console.error('핀 토글 실패:', err);
    }
  };

  return (
    <div
      className="title-bar h-9 backdrop-blur-md flex items-center
                 justify-between px-3 select-none rounded-t-xl transition-colors duration-200"
      style={{ WebkitAppRegion: 'drag' }}
    >
      {/* 앱 제목 */}
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
        WeGet TODO
      </span>

      {/* 컨트롤 버튼 */}
      <div className="flex items-center gap-1" style={{ WebkitAppRegion: 'no-drag' }}>

        {/* 🌙/☀️ 다크모드 토글 */}
        <button
          onClick={toggleTheme}
          className="w-7 h-7 rounded-md flex items-center justify-center text-sm
                     transition-colors hover:bg-gray-100 dark:hover:bg-gray-700
                     text-gray-400"
          title={isDark ? '라이트 모드' : '다크 모드'}
        >
          {isDark ? '☀️' : '🌙'}
        </button>

        {/* 핀 버튼 */}
        <button
          onClick={handlePin}
          className={`w-7 h-7 rounded-md flex items-center justify-center text-sm
                     transition-colors hover:bg-gray-100 dark:hover:bg-gray-700
                     ${pinned ? 'text-brand' : 'text-gray-400'}`}
          title={pinned ? '핀 해제' : '항상 앞에'}
        >
          📌
        </button>

        {/* 최소화 */}
        <button
          onClick={minimizeWindow}
          className="w-7 h-7 rounded-md flex items-center justify-center
                     text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700
                     hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          title="최소화"
        >
          ─
        </button>

        {/* 닫기 */}
        <button
          onClick={closeWindow}
          className="w-7 h-7 rounded-md flex items-center justify-center
                     text-gray-400 hover:bg-red-500 hover:text-white transition-colors"
          title="닫기"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
