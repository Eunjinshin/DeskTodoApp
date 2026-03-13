/**
 * TODO 입력 폼 컴포넌트
 *
 * [Tailwind CSS 클래스 설명 (자주 쓰이는 것)]
 * flex       → display: flex (수평/수직 배치에 사용)
 * flex-col   → flex-direction: column (세로 배치)
 * gap-3      → gap: 0.75rem (자식 요소 간 간격)
 * w-full     → width: 100%
 * mb-6       → margin-bottom: 1.5rem
 * text-sm    → font-size: 0.875rem
 * text-red-400 → color: 빨간색 계열
 *
 * [보안 참고]
 * - 이 폼에서 입력된 데이터는 todoApi.js의 sanitizeTodo()로 정제됩니다.
 * - React의 JSX는 자동으로 값을 이스케이프하여 XSS를 방어합니다.
 * - dangerouslySetInnerHTML은 절대 사용하지 않습니다.
 */
import { useState } from 'react';

/**
 * 우선순위 옵션 배열
 * value: DB에 저장되는 숫자
 * label: 화면에 표시되는 텍스트
 */
const PRIORITY_OPTIONS = [
  { value: 0, label: '보통' },
  { value: 1, label: '높음' },
  { value: 2, label: '긴급 🔥' },
];

export default function TodoForm({ onSubmit }) {
  // ── 폼 상태 ──
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState(0);
  const [dueDate, setDueDate] = useState('');

  /** 폼 제출 핸들러 */
  const handleSubmit = (e) => {
    // 기본 form submit 동작 방지 (페이지 새로고침 방지)
    e.preventDefault();

    // 빈 제목 방지
    if (!title.trim()) return;

    // 부모 컴포넌트에 데이터 전달
    onSubmit({
      title: title.trim(),
      content: content.trim() || null,
      priority,
      dueDate: dueDate || null,
    });

    // 폼 초기화
    setTitle('');
    setContent('');
    setPriority(0);
    setDueDate('');
  };

  return (
    /**
     * Tailwind 클래스 설명:
     * card       → index.css에서 정의한 커스텀 클래스 (bg + rounded + padding + border)
     * mb-6       → 아래쪽 여백 1.5rem
     * animate-fadeIn → tailwind.config.js에서 정의한 페이드인 애니메이션
     */
    <form onSubmit={handleSubmit} className="card mb-6 animate-fadeIn">
      {/* 
        flex flex-col gap-3:
        - flex: 플렉스 박스 활성화
        - flex-col: 세로 방향으로 자식 요소 배치
        - gap-3: 자식 요소 간 0.75rem 간격
      */}
      <div className="flex flex-col gap-3">

        {/* 제목 입력 */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="할 일을 입력하세요..."
          className="input-field text-lg"
          maxLength={200}
          required
        />

        {/* 내용 입력 (선택) */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="상세 내용 (선택)"
          className="input-field resize-none h-20"
          maxLength={5000}
        />

        {/* 
          하단 옵션: 우선순위 + 마감일 + 추가 버튼
          flex items-center gap-3: 수평 배치 + 수직 가운데 정렬 + 간격
          flex-wrap: 공간이 부족하면 줄바꿈
        */}
        <div className="flex items-center gap-3 flex-wrap">

          {/* 우선순위 선택 */}
          <select
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            className="input-field w-auto"
          >
            {PRIORITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* 마감일 선택 */}
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="input-field w-auto"
          />

          {/* 
            ml-auto: 왼쪽 마진을 자동으로 → 오른쪽 끝으로 밀림
            btn-primary: index.css에서 정의한 커스텀 버튼 스타일
          */}
          <button type="submit" className="btn-primary ml-auto">
            ➕ 추가
          </button>
        </div>
      </div>
    </form>
  );
}
