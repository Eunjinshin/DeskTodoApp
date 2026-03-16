/**
 * TODO 입력 폼 컴포넌트 (다크 모드 지원)
 */
import { useState } from 'react';

const today = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const PRIORITY_OPTIONS = [
  { value: 0, label: '보통' },
  { value: 1, label: '높음' },
  { value: 2, label: '긴급 🔥' },
];

export default function TodoForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState(0);
  const [dueDate, setDueDate] = useState(today());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      content: content.trim() || null,
      priority,
      dueDate: dueDate || null,
    });

    setTitle('');
    setContent('');
    setPriority(0);
    setDueDate(today());
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 animate-fadeIn">
      <div className="flex flex-col gap-2.5">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="할 일을 입력하세요..."
          className="input-field"
          maxLength={200}
          required
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="상세 내용 (선택)"
          className="input-field h-16 resize-none"
          maxLength={5000}
        />

        <div className="flex gap-2">
          <select
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            className="input-field w-auto dark:bg-surface-darkInput"
          >
            {PRIORITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="dark:bg-surface-darkInput">
                {opt.label}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="input-field flex-1 dark:bg-surface-darkInput"
          />
        </div>

        <button type="submit" className="btn-primary dark:bg-brand-midnight">
          + 추가
        </button>
      </div>
    </form>
  );
}
