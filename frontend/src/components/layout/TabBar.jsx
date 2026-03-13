/**
 * 탭 네비게이션 컴포넌트
 *
 * [Tailwind 클래스]
 * border-b → 아래쪽 테두리
 * gap-0    → 탭 사이 간격 없음
 * text-xs  → 작은 글씨
 */

const TABS = [
  { id: 'todo',     label: '📝 TODO',  },
  { id: 'calendar', label: '📅 달력',  },
  { id: 'settings', label: '⚙️ 설정', },
];

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <div className="flex bg-surface border-b border-gray-700/50">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-2 text-xs font-medium transition-colors
            ${activeTab === tab.id
              ? 'text-brand border-b-2 border-brand bg-surface-card/50'
              : 'text-gray-500 hover:text-gray-300 hover:bg-surface-hover/50'
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
