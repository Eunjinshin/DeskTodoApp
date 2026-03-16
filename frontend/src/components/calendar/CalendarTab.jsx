/**
 * 달력 탭 (다크 모드 지원)
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import * as scheduleApi from '../../api/scheduleApi';

const RECURRENCE_OPTIONS = [
  { value: 'once',    label: '당일' },
  { value: 'daily',   label: '매일 반복' },
  { value: 'weekly',  label: '매주 반복' },
  { value: 'monthly', label: '매달 반복' },
  { value: 'yearly',  label: '매년 반복' },
];

const RECURRENCE_LABELS = {
  once: '', daily: '🔄매일', weekly: '🔄매주', monthly: '🔄매달', yearly: '🔄매년',
};

function matchesDate(s, dateStr) {
  const start = s.start_date;
  if (!start || dateStr < start) return false;
  const rec = s.recurrence || 'once';
  if (rec === 'once') {
    return start === dateStr || (s.end_date && dateStr >= start && dateStr <= s.end_date);
  }
  const sd = new Date(start + 'T00:00:00');
  const td = new Date(dateStr + 'T00:00:00');
  switch (rec) {
    case 'daily': return true;
    case 'weekly': return sd.getDay() === td.getDay();
    case 'monthly': return sd.getDate() === td.getDate();
    case 'yearly': return sd.getMonth() === td.getMonth() && sd.getDate() === td.getDate();
    default: return start === dateStr;
  }
}

export default function CalendarTab() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedules, setSchedules] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('#f2d5e0');
  const [recurrence, setRecurrence] = useState('once');
  const [expandedId, setExpandedId] = useState(null);

  const loadSchedules = useCallback(async () => {
    try {
      const list = await scheduleApi.listSchedules();
      setSchedules(list);
    } catch (err) {
      console.error('일정 로드 실패:', err);
    }
  }, []);

  useEffect(() => { loadSchedules(); }, [loadSchedules]);

  const dateStr = selectedDate.toLocaleDateString('en-CA'); // YYYY-MM-DD 포맷

  const daySchedules = useMemo(() =>
    schedules.filter(s => matchesDate(s, dateStr)),
    [schedules, dateStr]
  );

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await scheduleApi.createSchedule({
        title: title.trim(),
        content: content.trim() || null,
        startDate: dateStr,
        color,
        recurrence,
      });
      setTitle('');
      setContent('');
      setRecurrence('once');
      await loadSchedules();
    } catch (err) {
      console.error('일정 추가 실패:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('이 일정을 삭제하시겠습니까?')) return;
    try {
      await scheduleApi.deleteSchedule(id);
      await loadSchedules();
    } catch (err) {
      console.error('일정 삭제 실패:', err);
    }
  };

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const d = date.toLocaleDateString('en-CA');
    if (!schedules.some(s => matchesDate(s, d))) return null;
    return (
      <div className="flex justify-center mt-0.5">
        <div className="w-1 h-1 rounded-full bg-brand" />
      </div>
    );
  };

  return (
    <div className="p-3 sm:p-4 flex flex-col gap-3 animate-fadeIn">
      {/* 달력 Wrapper */}
      <div className="calendar-wrapper w-full rounded-xl overflow-hidden shadow-sm dark:shadow-none border border-gray-100 dark:border-[#27272a] transition-colors duration-200">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          locale="ko-KR"
          tileContent={tileContent}
          className="win-calendar w-full border-none"
          formatDay={(locale, date) => date.getDate()}
        />
      </div>

      {/* 일정 목록 및 폼 */}
      <div className="card space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          📅 {dateStr}
        </h3>

        {daySchedules.length === 0 && (
          <p className="text-xs text-gray-400 dark:text-gray-500 italic">등록된 일정이 없습니다.</p>
        )}

        <div className="space-y-2">
          {daySchedules.map(s => (
            <div key={s.id} className="group border-b border-gray-50 dark:border-gray-700 pb-2 last:border-0">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                     style={{ backgroundColor: s.color || '#f2d5e0' }} />
                <button
                  onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
                  className="flex-1 text-left text-gray-800 dark:text-gray-200 truncate font-medium hover:text-brand transition-colors"
                >
                  {s.title}
                  {s.content && <span className="text-gray-400 ml-1 text-xs">▾</span>}
                </button>
                <div className="flex items-center gap-2">
                  {RECURRENCE_LABELS[s.recurrence] && (
                    <span className="text-[10px] text-gray-400">{RECURRENCE_LABELS[s.recurrence]}</span>
                  )}
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors"
                  >✕</button>
                </div>
              </div>
              {expandedId === s.id && s.content && (
                <p className="text-xs text-gray-500 dark:text-gray-400 ml-4.5 mt-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-2.5 py-1.5">
                  {s.content}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* 일정 추가 폼 */}
        <form onSubmit={handleAdd} className="pt-2 border-t border-gray-100 dark:border-gray-700 space-y-2">
          <div className="flex gap-2">
            <input
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              className="w-9 h-9 p-0 rounded-lg cursor-pointer border-0 bg-transparent flex-shrink-0"
            />
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="일정 제목..."
              className="input-field flex-1"
              maxLength={100}
            />
          </div>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="상세 설명 (선택)"
            className="input-field h-16 resize-none"
            maxLength={1000}
          />
          <div className="flex gap-2">
            <select
              value={recurrence}
              onChange={e => setRecurrence(e.target.value)}
              className="input-field flex-1"
            >
              {RECURRENCE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value} className="dark:bg-gray-800">{opt.label}</option>
              ))}
            </select>
            <button type="submit" className="btn-primary w-24">추가</button>
          </div>
        </form>
      </div>
    </div>
  );
}
