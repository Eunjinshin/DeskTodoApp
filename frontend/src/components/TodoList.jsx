/**
 * TODO 목록 컴포넌트
 *
 * [Tailwind 추가 설명]
 * space-y-3 → 자식 요소 사이에 세로 간격 0.75rem 추가
 *             (gap과 비슷하지만 flex 없이도 동작)
 * text-center → text-align: center
 * py-12     → padding-top, padding-bottom: 3rem
 */
import TodoItem from './TodoItem';

export default function TodoList({ todos, loading, onToggle, onDelete }) {
  // ── 로딩 상태 ──
  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">
        {/* animate-spin: 회전 애니메이션 (Tailwind 내장) */}
        <div className="animate-spin text-3xl mb-2">⏳</div>
        <p>불러오는 중...</p>
      </div>
    );
  }

  // ── 빈 목록 ──
  if (!todos || todos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-4xl mb-3">📝</p>
        <p>아직 할 일이 없습니다.</p>
        <p className="text-sm mt-1">위에서 새로운 할 일을 추가해보세요!</p>
      </div>
    );
  }

  // ── TODO 목록 렌더링 ──
  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        /**
         * [React key 속성]
         * 목록을 렌더링할 때 각 항목에 고유한 key를 지정해야 합니다.
         * React가 어떤 항목이 변경/추가/삭제되었는지 효율적으로 판단합니다.
         * todo.id(UUID)를 사용하여 고유성을 보장합니다.
         */
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
