/**
 * 메인 App 컴포넌트 (다크 모드 지원)
 * - 반응형: 창 크기에 따라 100% 채움
 * - TODO 날짜 필터: 폼 아래 날짜 선택 → 해당 날짜 TODO만 표시
 */
import { useState, useMemo } from 'react';
import TitleBar from './components/layout/TitleBar';
import TabBar from './components/layout/TabBar';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import CalendarTab from './components/calendar/CalendarTab';
import SettingsTab from './components/settings/SettingsTab';
import { useTodos } from './hooks/useTodos';

/**
 * 로컬 시간대 기준 오늘 날짜 (YYYY-MM-DD)
 * toISOString()은 UTC 기준이므로 한국(UTC+9) 자정~9시 사이 날짜 밀림 방지
 */
const today = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('todo');
  const [filterDate, setFilterDate] = useState(today());
  const {
    todos, loading, error,
    addTodo, editTodo, toggleTodo, removeTodo, clearError,
  } = useTodos();

  /** 선택 날짜에 해당하는 TODO만 필터 */
  const filteredTodos = useMemo(() => {
    if (!filterDate) return todos;
    return todos.filter(t => t.due_date === filterDate);
  }, [todos, filterDate]);

  /** 카운트 */
  const doneCount = filteredTodos.filter(t => t.is_done).length;

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden transition-colors duration-200">
      <TitleBar />
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 탭 콘텐츠 */}
      <div className="flex-1 overflow-y-auto">

        {/* === TODO 탭 === */}
        {activeTab === 'todo' && (
          <div className="p-3 sm:p-4">
            {/* 에러 */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900
                              text-red-600 dark:text-red-400
                              rounded-xl px-3 py-2 mb-3 flex justify-between items-center text-sm">
                <span>{error}</span>
                <button onClick={clearError}
                  className="text-red-400 hover:text-red-600 dark:hover:text-red-200">✕</button>
              </div>
            )}

            {/* 입력 폼 */}
            <TodoForm onSubmit={addTodo} />

            {/* 날짜 필터 바 */}
            <div className="filter-bar flex items-center gap-2 mb-3 rounded-xl px-3 py-2 shadow-sm transition-colors duration-200">
              {/* 날짜 선택 */}
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="bg-gray-50 dark:bg-[#111] text-sm text-gray-700 dark:text-gray-200
                           px-2 py-1 rounded-md border border-gray-200 dark:border-[#3f3f46] outline-none"
              />

              {/* 오늘 / 전체 버튼 */}
              <div className="ml-auto flex items-center gap-1.5">
                <button
                  onClick={() => setFilterDate(today())}
                  className={`text-[11px] px-3 py-1 rounded-md font-bold transition-all
                    ${filterDate === today()
                      ? 'bg-brand dark:bg-[#444] text-gray-700 dark:text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-[#222] text-gray-400 dark:text-gray-600'
                    }`}
                >
                  오늘
                </button>
                <button
                  onClick={() => setFilterDate('')}
                  className={`text-[11px] px-3 py-1 rounded-md font-bold transition-all
                    ${!filterDate
                      ? 'bg-brand dark:bg-[#444] text-gray-700 dark:text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-[#222] text-gray-400 dark:text-gray-500'
                    }`}
                >
                  전체
                </button>
              </div>

              {/* 카운터 */}
              <div className="text-xs text-gray-400 ml-2">
                {filteredTodos.length}개 · 완료 {doneCount}
              </div>
            </div>

            {/* 목록 */}
            <TodoList
              todos={filteredTodos}
              loading={loading}
              onToggle={toggleTodo}
              onEdit={editTodo}
              onDelete={removeTodo}
            />
          </div>
        )}

        {/* === 달력 탭 === */}
        {activeTab === 'calendar' && <CalendarTab />}

        {/* === 설정 탭 === */}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
}
