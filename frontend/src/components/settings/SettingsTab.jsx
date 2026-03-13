/**
 * 설정 탭 컴포넌트
 * - 투명도 조절 (사용자가 디자인 선택)
 * - 핀 토글
 *
 * [Tailwind 클래스]
 * range → <input type="range"> 기본 스타일
 * accent-brand → 슬라이더의 트랙 색상을 브랜드 색으로 변경
 */
import { useState } from 'react';
import { setOpacity, pinWindow, unpinWindow } from '../../api/windowApi';

export default function SettingsTab() {
  const [opacity, setOpacityState] = useState(1);
  const [pinned, setPinned] = useState(false);

  /** 투명도 변경 */
  const handleOpacity = async (e) => {
    const val = parseFloat(e.target.value);
    setOpacityState(val);
    try {
      await setOpacity(val);
    } catch (err) {
      console.error('투명도 변경 실패:', err);
    }
  };

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
    <div className="p-4 space-y-6 animate-fadeIn">
      <h2 className="text-lg font-semibold text-gray-200">⚙️ 설정</h2>

      {/* 투명도 조절 */}
      <div className="card space-y-3">
        <label className="text-sm font-medium text-gray-300">
          🎨 창 투명도
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0.3"
            max="1"
            step="0.05"
            value={opacity}
            onChange={handleOpacity}
            className="flex-1 accent-brand h-2 rounded-lg cursor-pointer"
          />
          <span className="text-sm text-gray-400 w-12 text-right">
            {Math.round(opacity * 100)}%
          </span>
        </div>
        <p className="text-xs text-gray-500">
          슬라이더를 움직여 창의 투명도를 조절할 수 있습니다.
        </p>
      </div>

      {/* 핀(항상 앞에) 토글 */}
      <div className="card flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-300">📌 항상 앞에 표시</p>
          <p className="text-xs text-gray-500 mt-1">
            다른 창 위에 항상 떠 있도록 합니다.
          </p>
        </div>
        <button
          onClick={handlePin}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${pinned
              ? 'bg-brand text-white'
              : 'bg-surface-hover text-gray-400 hover:text-gray-200'
            }`}
        >
          {pinned ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* 앱 정보 */}
      <div className="text-center text-xs text-gray-600 pt-4">
        <p>WeGet TODO v1.0.0</p>
        <p>🔒 SQLCipher 암호화 적용</p>
      </div>
    </div>
  );
}
