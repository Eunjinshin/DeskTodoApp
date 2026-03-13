/**
 * TODO 항목 컴포넌트
 *
 * [Tailwind CSS 추가 설명]
 * line-through → text-decoration: line-through (취소선)
 * opacity-60   → 투명도 60% (완료된 항목을 흐리게 표시)
 * cursor-pointer → 마우스 커서를 포인터로 변경
 * transition-all → 모든 CSS 속성에 전환 효과 적용
 * truncate     → 텍스트가 넘치면 "..."으로 표시
 *
 * [보안 참고]
 * - todo.title, todo.content 등 사용자 입력값을 렌더링할 때
 *   React JSX의 자동 이스케이프가 적용됩니다.
 * - innerHtml, dangerouslySetInnerHTML은 사용하지 않습니다.
 */

/** 우선순위별 배지 색상 */
const PRIORITY_COLORS = {
  0: 'bg-gray-600 text-gray-300',     // 보통
  1: 'bg-yellow-600 text-yellow-100', // 높음
  2: 'bg-red-600 text-red-100',       // 긴급
};

/** 우선순위 라벨 */
const PRIORITY_LABELS = {
  0: '보통',
  1: '높음',
  2: '긴급',
};

export default function TodoItem({ todo, onToggle, onDelete }) {
  const isDone = Boolean(todo.is_done);
  const priorityColor = PRIORITY_COLORS[todo.priority] || PRIORITY_COLORS[0];
  const priorityLabel = PRIORITY_LABELS[todo.priority] || '보통';

  return (
    /**
     * Tailwind 클래스 설명:
     * card           → 커스텀 카드 스타일
     * flex items-start → 수평 배치 + 상단 정렬
     * gap-3          → 자식 간 0.75rem 간격
     * group          → 자식의 group-hover: 클래스를 활성화
     *                   (카드에 호버하면 삭제 버튼이 보이는 효과)
     * hover:border-brand/30 → 호버 시 테두리 색상 변경 (30% 투명도)
     * transition-all → 모든 속성에 전환 효과
     */
    <div className="card flex items-start gap-3 group hover:border-brand/30 transition-all animate-slideUp">

      {/* 체크박스: 완료/미완료 토글 */}
      <input
        type="checkbox"
        checked={isDone}
        onChange={() => onToggle(todo)}
        className="mt-1 w-5 h-5 rounded border-gray-500 cursor-pointer
                   accent-brand flex-shrink-0"
      />

      {/* 본문 영역 */}
      <div className="flex-1 min-w-0">
        {/* 
          제목
          isDone이면 취소선(line-through) + 투명도(opacity-60) 적용
        */}
        <p className={`font-medium text-gray-100 ${isDone ? 'line-through opacity-60' : ''}`}>
          {todo.title}
        </p>

        {/* 내용 (있을 경우에만 표시) */}
        {todo.content && (
          <p className="text-sm text-gray-400 mt-1 truncate">
            {todo.content}
          </p>
        )}

        {/* 
          메타 정보: 우선순위 배지 + 마감일
          mt-2: 위쪽 여백 0.5rem
          text-xs: 아주 작은 글씨
          rounded-full: 완전 둥근 모서리 (알약 형태)
          px-2 py-0.5: 좌우 패딩 0.5rem, 상하 패딩 0.125rem
        */}
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColor}`}>
            {priorityLabel}
          </span>

          {todo.due_date && (
            <span className="text-xs text-gray-500">
              📅 {todo.due_date}
            </span>
          )}
        </div>
      </div>

      {/* 
        삭제 버튼
        opacity-0 group-hover:opacity-100:
        → 평소에는 보이지 않다가, 카드(group)에 호버하면 나타남
        transition-opacity: 투명도 변화에 전환 효과
      */}
      <button
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity
                   text-gray-500 hover:text-red-400 text-lg flex-shrink-0"
        title="삭제"
      >
        🗑️
      </button>
    </div>
  );
}
