/**
 * 탭 네비게이션 컴포넌트 (스크린샷 샘플 100% 재현)
 */
const TABS = [
  { id: 'todo',     label: 'TODO'  },
  { id: 'calendar', label: '달력'  },
  { id: 'settings', label: '설정'  },
];

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <div className="tab-bar-container flex items-center px-2 py-1.5 border-b border-gray-100 dark:border-[#222]">
      {TABS.map((tab, index) => (
        <div key={tab.id} className="flex flex-1 items-center">
          <button
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-200
              ${activeTab === tab.id
                ? 'bg-[#f0f0f0] dark:bg-[#333] text-gray-800 dark:text-white'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400'
              }`}
          >
            {tab.label}
          </button>
          
          {/* 탭 사이 구분선 (마지막 탭 제외, 활성화된 탭 주변 제외) */}
          {index < TABS.length - 1 && activeTab !== tab.id && activeTab !== TABS[index+1].id && (
            <div className="w-[1px] h-3 bg-gray-200 dark:bg-[#222] mx-0.5" />
          )}
        </div>
      ))}
    </div>
  );
}
