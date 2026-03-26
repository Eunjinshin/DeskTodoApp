import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { ipc } from '../lib/ipc';
import EventForm from '../components/EventForm';
import EventFilterBar from '../components/EventFilterBar';
import TodoItem from '../components/TodoItem';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';

export default function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [todos, setTodos] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [filterMode, setFilterMode] = useState('all');

  const loadData = async () => {
    try {
      const allEvents = await ipc.getEvents();
      setEvents(allEvents);
      const allTodos = await ipc.getTodos();
      setTodos(allTodos);
    } catch (err) {
      console.error('Failed to load events/todos', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveEvent = async (eventData) => {
    if (editingEvent) {
      await ipc.updateEvent(editingEvent.id, eventData);
    } else {
      await ipc.createEvent(eventData);
    }
    setIsFormOpen(false);
    setEditingEvent(null);
    loadData();
  };

  const handleDeleteEvent = async (id) => {
    if (confirm('Delete this event?')) {
      await ipc.deleteEvent(id);
      loadData();
    }
  };

  const openNewEvent = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const openEditEvent = (ev) => {
    setEditingEvent(ev);
    setIsFormOpen(true);
  };

  const getTileContent = ({ date, view }) => {
    if (view === 'month') {
      const offset = date.getTimezoneOffset()
      const dStr = new Date(date.getTime() - (offset*60*1000)).toISOString().split('T')[0];
      
      const dayEvents = events.filter(e => e.start_date === dStr);
      const dayTodos = todos.filter(t => t.due_date === dStr);

      if (dayEvents.length === 0 && dayTodos.length === 0) return null;
      
      return (
        <div className="flex justify-center flex-wrap gap-0.5 mt-1">
          {dayEvents.map(e => (
            <div key={e.id} className="w-1.5 h-1.5 rounded-full bg-blue-500" title={e.title} />
          ))}
          {dayTodos.map(t => (
            <div key={t.id} className="w-1.5 h-1.5 rounded-full bg-pink-500" title={t.title} />
          ))}
        </div>
      );
    }
    return null;
  };

  const offset = date.getTimezoneOffset()
  const currentSelectedDateStr = new Date(date.getTime() - (offset*60*1000)).toISOString().split('T')[0];
  const todayStr = new Date(new Date().getTime() - (new Date().getTimezoneOffset()*60*1000)).toISOString().split('T')[0];
  
  const targetDateStr = filterMode === 'today' ? todayStr : currentSelectedDateStr;
  
  const displayingEvents = events.filter(e => e.start_date === targetDateStr);
  const displayingTodos = todos.filter(t => t.due_date === targetDateStr);

  return (
    <div className="h-full flex flex-col lg:flex-row gap-10 w-full animate-in fade-in duration-500">
      <div className="lg:w-[380px] flex flex-col shrink-0">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Calendar</h1>
            <p className="text-slate-400 dark:text-slate-500 mt-1 font-medium">Your schedule, beautifully organized.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-pink-100 dark:border-slate-700 p-4 shrink-0 overflow-hidden">
          <Calendar
            onChange={setDate}
            value={filterMode === 'today' ? new Date() : date}
            tileContent={getTileContent}
            className="w-full !border-0 font-sans dark:text-slate-200 dark:bg-slate-800"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col pt-2 h-full overflow-hidden shrink-0">
        <div className="flex justify-between items-center mb-6 h-[46px] mt-2">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {filterMode === 'today' ? 'Today\'s Schedule' : format(date, 'MMMM d, yyyy')}
          </h2>
          <button 
            onClick={openNewEvent}
            className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-medium shadow-md transition-transform active:scale-95 text-sm"
          >
            <Plus size={16} />
            <span>New Event</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 pb-20 space-y-6">
          {/* Events Section */}
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 pl-1">Events</h3>
            {displayingEvents.length === 0 ? (
              <p className="text-slate-400 text-sm italic pl-1">No events scheduled.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {displayingEvents.map(ev => (
                  <div key={ev.id} className="group p-4 rounded-xl border border-blue-100 bg-white dark:bg-slate-800 dark:border-slate-700 hover:shadow-md transition-all flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200">{ev.title}</h4>
                      {ev.content && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{ev.content}</p>}
                      {ev.recurrence_type !== 'none' && (
                        <span className="inline-block mt-2 text-xs bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded">
                          ↻ {ev.recurrence_type}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditEvent(ev)} className="p-1.5 text-slate-400 hover:text-blue-500 rounded-full hover:bg-blue-50 dark:hover:bg-slate-700">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDeleteEvent(ev.id)} className="p-1.5 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-slate-700">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Todos Section */}
          <div>
            <h3 className="text-sm font-semibold text-pink-500 uppercase tracking-wider mb-3 pl-1">Due Today</h3>
            {displayingTodos.length === 0 ? (
              <p className="text-slate-400 text-sm italic pl-1">No tasks due this day.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {displayingTodos.map(todo => (
                  <TodoItem 
                    key={todo.id} 
                    todo={todo}
                    onToggle={async (t) => {
                      await ipc.updateTodo(t.id, { completed: t.completed ? 0 : 1 });
                      loadData();
                    }}
                    onEdit={() => {}} 
                    onDelete={async (id) => {
                      if (confirm('Delete?')) { await ipc.deleteTodo(id); loadData() }
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <EventFilterBar mode={filterMode} setMode={setFilterMode} />

      {isFormOpen && (
        <EventForm 
          selectedDate={filterMode === 'today' ? new Date() : date}
          initialData={editingEvent}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveEvent}
        />
      )}
    </div>
  );
}
