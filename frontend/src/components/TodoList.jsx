/**
 * TODO 목록 컴포넌트 (다크 모드 지원)
 */
import TodoItem from './TodoItem';

export default function TodoList({ todos, loading, onToggle, onEdit, onDelete }) {
  // ── 로딩 상태 ──
  if (loading) {
    return (
      <div className="text-center py-12 text-gray-400 dark:text-gray-500">
        <div className="animate-spin text-3xl mb-2">⏳</div>
        <p>불러오는 중...</p>
      </div>
    );
  }

  // ── 빈 목록 ──
  if (!todos || todos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 dark:text-gray-500">
        <p className="text-4xl mb-3">📝</p>
        <p>아직 할 일이 없습니다.</p>
        <p className="text-sm mt-1 text-gray-300 dark:text-gray-600">
          위에서 새로운 할 일을 추가해보세요!
        </p>
      </div>
    );
  }

  // ── TODO 목록 렌더링 ──
  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
