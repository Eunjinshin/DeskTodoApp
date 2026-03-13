/**
 * 달력 탭 (3차 보완)
 * - 일정에 내용(content) 입력 및 표시 추가
 * - 내용 클릭으로 접기/펼치기
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
  const [content, setContent] = useState('');   // 일정 내용
  const [color, setColor] = useState('#667eea');
  const [recurrence, setRecurrence] = useState('once');
  const [expandedId, setExpandedId] = useState(null); // 펼쳐진 일정 ID

  const loadSchedules = useCallback(async () => {
    try {
      const list = await scheduleApi.listSchedules();
      setSchedules(list);
    } catch (err) {
      console.error('일정 로드 실패:', err);
    }
  }, []);

  useEffect(() => { loadSchedules(); }, [loadSchedules]);

  const dateStr = selectedDate.toISOString().split('T')[0];

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
    const d = date.toISOString().split('T')[0];
    if (!schedules.some(s => matchesDate(s, d))) return null;
    return (
      <div className="flex justify-center mt-0.5">
        <div className="w-1 h-1 rounded-full bg-blue-500" />
      </div>
    );
  };

  return (
    <div className="p-3 sm:p-4 flex flex-col gap-3 animate-fadeIn">
      {/* 달력 */}
      <div className="calendar-wrapper rounded-lg overflow-hidden">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          locale="ko-KR"
          tileContent={tileContent}
          className="win-calendar"
          formatDay={(locale, date) => date.getDate()}
        />
      </div>

      {/* 선택 날짜 일정 */}
      <div className="card">
        <h3 className="text-sm font-medium text-gray-300 mb-2">
          📅 {dateStr}
        </h3>

        {daySchedules.length === 0 && (
          <p className="text-xs text-gray-500 mb-2">등록된 일정이 없습니다.</p>
        )}

        <div className="space-y-1 mb-3">
          {daySchedules.map(s => (
            <div key={s.id} className="group">
              {/* 일정 헤더 */}
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full flex-shrink-0"
                     style={{ backgroundColor: s.color || '#667eea' }} />
                {/* 클릭하면 내용 접기/펼치기 */}
                <button
                  onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
                  className="flex-1 text-left text-gray-200 truncate hover:text-white transition-colors"
                >
                  {s.title}
                  {s.content && <span className="text-gray-600 ml-1 text-xs">▾</span>}
                </button>
                {RECURRENCE_LABELS[s.recurrence] && (
                  <span className="text-xs text-gray-500">{RECURRENCE_LABELS[s.recurrence]}</span>
                )}
                <button
                  onClick={() => handleDelete(s.id)}
                  className="text-gray-600 hover:text-red-400 text-xs
                             opacity-0 group-hover:opacity-100 transition-opacity"
                >✕</button>
              </div>

              {/* 일정 내용 (펼쳐진 경우) */}
              {expandedId === s.id && s.content && (
                <p className="text-xs text-gray-400 ml-4 mt-1 bg-surface/50 rounded px-2 py-1">
                  {s.content}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* 일정 추가 폼 (내용 필드 추가) */}
        <form onSubmit={handleAdd} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent flex-shrink-0"
            />
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="일정 제목..."
              className="input-field flex-1 text-sm"
              maxLength={100}
            />
          </div>
          {/* 내용 입력 */}
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="일정 내용 (선택)"
            className="input-field text-sm resize-none h-14"
            maxLength={1000}
          />
          <div className="flex gap-2">
            <select
              value={recurrence}
              onChange={e => setRecurrence(e.target.value)}
              className="input-field flex-1 text-sm"
            >
              {RECURRENCE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button type="submit" className="btn-primary text-sm px-3">추가</button>
          </div>
        </form>
      </div>
    </div>
  );
}
