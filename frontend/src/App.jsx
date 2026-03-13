/**
 * 메인 App 컴포넌트 (3차 보완)
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

/** 오늘 날짜 (YYYY-MM-DD) */
const today = () => new Date().toISOString().split('T')[0];

export default function App() {
  const [activeTab, setActiveTab] = useState('todo');
  const [filterDate, setFilterDate] = useState(today());
  const {
    todos, loading, error,
    addTodo, toggleTodo, removeTodo, clearError,
  } = useTodos();

  /** 선택 날짜에 해당하는 TODO만 필터 */
  const filteredTodos = useMemo(() => {
    if (!filterDate) return todos;
    return todos.filter(t => t.due_date === filterDate);
  }, [todos, filterDate]);

  /** 전체 TODO 중 필터 날짜의 카운트 */
  const doneCount = filteredTodos.filter(t => t.is_done).length;

  return (
    /**
     * 반응형 레이아웃:
     * w-full → 창 전체 너비 사용 (고정 max-w 없음)
     * flex flex-col → 세로 배치
     * h-screen → 창 높이 전체 사용
     */
    <div className="w-full h-screen bg-surface flex flex-col overflow-hidden">
      <TitleBar />
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 탭 콘텐츠: flex-1로 나머지 공간 채움 */}
      <div className="flex-1 overflow-y-auto">

        {/* === TODO 탭 === */}
        {activeTab === 'todo' && (
          <div className="p-3 sm:p-4">
            {/* 에러 */}
            {error && (
              <div className="bg-red-900/30 border border-red-700 text-red-300
                              rounded-lg px-3 py-2 mb-3 flex justify-between items-center text-sm">
                <span>{error}</span>
                <button onClick={clearError} className="text-red-400 hover:text-red-200">✕</button>
              </div>
            )}

            {/* 입력 폼 */}
            <TodoForm onSubmit={addTodo} />

            {/* 날짜 필터 */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-gray-500">📅</span>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="input-field w-auto text-xs"
              />
              <button
                onClick={() => setFilterDate(today())}
                className="text-xs text-brand hover:text-brand-light transition-colors"
              >
                오늘
              </button>
              <button
                onClick={() => setFilterDate('')}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                전체
              </button>

              {/* 카운터 (필터 결과) */}
              <div className="ml-auto text-xs text-gray-500">
                {filteredTodos.length}개 · 완료 {doneCount}
              </div>
            </div>

            {/* 목록 */}
            <TodoList
              todos={filteredTodos}
              loading={loading}
              onToggle={toggleTodo}
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
