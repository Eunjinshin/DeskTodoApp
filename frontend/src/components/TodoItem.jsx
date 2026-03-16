/**
 * TODO 항목 컴포넌트 (다크 모드 지원 + 수정 기능)
 *
 * [보안 참고]
 * - React JSX 자동 이스케이프 적용
 * - dangerouslySetInnerHTML 미사용
 * - 수정 데이터는 기존 sanitizeTodo()를 거쳐 정제
 */
import { useState } from 'react';

/** 우선순위별 배지 색상 (라이트/다크 공통) */
const PRIORITY_COLORS = {
  0: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
  1: 'bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400',
  2: 'bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400',
};

/** 우선순위 라벨 */
const PRIORITY_LABELS = { 0: '보통', 1: '높음', 2: '긴급' };

/** 우선순위 옵션 (편집 모드용) */
const PRIORITY_OPTIONS = [
  { value: 0, label: '보통' },
  { value: 1, label: '높음' },
  { value: 2, label: '긴급 🔥' },
];

export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const isDone = Boolean(todo.is_done);
  const priorityColor = PRIORITY_COLORS[todo.priority] || PRIORITY_COLORS[0];
  const priorityLabel = PRIORITY_LABELS[todo.priority] || '보통';

  // ── 편집 모드 상태 ──
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editPriority, setEditPriority] = useState(0);
  const [editDueDate, setEditDueDate] = useState('');

  /** 편집 모드 진입 */
  const startEdit = () => {
    setEditTitle(todo.title || '');
    setEditContent(todo.content || '');
    setEditPriority(todo.priority || 0);
    setEditDueDate(todo.due_date || '');
    setIsEditing(true);
  };

  /** 편집 취소 */
  const cancelEdit = () => setIsEditing(false);

  /** 편집 저장 */
  const saveEdit = async () => {
    if (!editTitle.trim()) return;
    await onEdit({
      id: todo.id,
      title: editTitle.trim(),
      content: editContent.trim() || null,
      priority: editPriority,
      dueDate: editDueDate || null,
    });
    setIsEditing(false);
  };

  /** Enter 저장, Escape 취소 */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit(); }
    if (e.key === 'Escape') cancelEdit();
  };

  // ── 편집 모드 ──
  if (isEditing) {
    return (
      <div className="todo-card flex flex-col gap-2 border-l-brand animate-fadeIn">
        <input type="text" value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className="input-field" maxLength={200} placeholder="제목" autoFocus />

        <textarea value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          onKeyDown={handleKeyDown}
          className="input-field resize-none h-16" maxLength={5000}
          placeholder="상세 내용 (선택)" />

        <div className="flex items-center gap-2 flex-wrap">
          <select value={editPriority}
            onChange={(e) => setEditPriority(Number(e.target.value))}
            className="input-field w-auto">
            {PRIORITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <input type="date" value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
            className="input-field w-auto" />

          <div className="ml-auto flex gap-2">
            <button onClick={saveEdit}
              className="px-3 py-1.5 bg-brand text-white rounded-lg text-sm
                         transition-colors hover:bg-brand-dark" title="저장">
              ✅ 저장
            </button>
            <button onClick={cancelEdit}
              className="px-3 py-1.5 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-200
                         rounded-lg text-sm transition-colors hover:bg-gray-300 dark:hover:bg-gray-500"
              title="취소">
              ❌ 취소
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── 보기 모드 ──
  return (
    <div className="todo-card flex items-start gap-3 group
                    hover:shadow-md dark:hover:shadow-none dark:hover:border-brand/30
                    transition-all animate-slideUp">
      {/* 원형 체크박스 */}
      <input type="checkbox" checked={isDone} onChange={() => onToggle(todo)}
        className="circle-checkbox mt-1" />

      {/* 본문 */}
      <div className="flex-1 min-w-0">
        <p className={`todo-title font-semibold text-gray-800 dark:text-gray-100
                       ${isDone ? 'line-through opacity-50' : ''}`}>
          {todo.title}
        </p>

        {todo.content && (
          <p className="todo-content text-sm text-gray-400 dark:text-zinc-500 mt-0.5 truncate">
            {todo.content}
          </p>
        )}

        <div className="flex items-center gap-2 mt-1.5">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColor}`}>
            {priorityLabel}
          </span>
          {todo.due_date && (
            <span className="text-xs text-gray-400">{todo.due_date}</span>
          )}
        </div>
      </div>

      {/* 액션 버튼 (호버) */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button onClick={startEdit}
          className="text-gray-300 dark:text-gray-600 hover:text-brand text-lg" title="수정">
          ✏️
        </button>
        <button onClick={() => onDelete(todo.id)}
          className="text-gray-300 dark:text-gray-600 hover:text-red-400 text-lg" title="삭제">
          🗑️
        </button>
      </div>
    </div>
  );
}
