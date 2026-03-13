/**
 * 커스텀 타이틀바 컴포넌트
 *
 * [왜 커스텀 타이틀바가 필요한가?]
 * frame: false로 기본 타이틀바를 제거했으므로 직접 구현합니다.
 * -webkit-app-region: drag → 이 영역을 드래그하면 창이 이동합니다.
 * -webkit-app-region: no-drag → 버튼 클릭이 가능하도록 드래그 해제합니다.
 */
import { useState } from 'react';
import { pinWindow, unpinWindow, minimizeWindow, closeWindow } from '../../api/windowApi';

export default function TitleBar() {
  const [pinned, setPinned] = useState(false);

  /** 핀 토글 */
  const handlePin = async () => {
    try {
      if (pinned) {
        await unpinWindow();
      } else {
        await pinWindow();
      }
      setPinned(!pinned);
    } catch (err) {
      console.error('핀 토글 실패:', err);
    }
  };

  return (
    /**
     * [Tailwind 클래스]
     * h-9: 높이 2.25rem
     * select-none: 텍스트 선택 방지 (드래그 영역이므로)
     *
     * style={{ WebkitAppRegion: 'drag' }}
     * → 이 영역을 드래그하면 전체 창이 이동합니다.
     */
    <div
      className="h-9 bg-surface/80 backdrop-blur-md flex items-center justify-between
                 px-3 border-b border-gray-700/50 select-none rounded-t-xl"
      style={{ WebkitAppRegion: 'drag' }}
    >
      {/* 앱 제목 */}
      <span className="text-xs font-medium text-gray-400">WeGet TODO</span>

      {/* 
        컨트롤 버튼 영역 
        style={{ WebkitAppRegion: 'no-drag' }}
        → 버튼 클릭이 동작하도록 드래그를 해제합니다.
      */}
      <div className="flex items-center gap-1" style={{ WebkitAppRegion: 'no-drag' }}>
        {/* 핀 버튼: 항상 앞에 표시 토글 */}
        <button
          onClick={handlePin}
          className={`w-7 h-7 rounded-md flex items-center justify-center text-sm
                     transition-colors hover:bg-surface-hover
                     ${pinned ? 'text-brand' : 'text-gray-500'}`}
          title={pinned ? '핀 해제' : '항상 앞에'}
        >
          📌
        </button>

        {/* 최소화 */}
        <button
          onClick={minimizeWindow}
          className="w-7 h-7 rounded-md flex items-center justify-center
                     text-gray-500 hover:bg-surface-hover hover:text-gray-300 transition-colors"
          title="최소화"
        >
          ─
        </button>

        {/* 닫기 */}
        <button
          onClick={closeWindow}
          className="w-7 h-7 rounded-md flex items-center justify-center
                     text-gray-500 hover:bg-red-600 hover:text-white transition-colors"
          title="닫기"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
