import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function EventForm({ initialData, selectedDate, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    start_date: '',
    end_date: '',
    recurrence_type: 'none',
    recurrence_rule: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        start_date: initialData.start_date || '',
        end_date: initialData.end_date || '',
        recurrence_type: initialData.recurrence_type || 'none',
        recurrence_rule: initialData.recurrence_rule || ''
      });
    } else if (selectedDate) {
      const todayISO = new Date().toISOString().split('T')[0];
      // Format selectedDate to match 'yyyy-mm-dd' local date string equivalent
      const offset = selectedDate.getTimezoneOffset()
      const defaultDate = new Date(selectedDate.getTime() - (offset*60*1000)).toISOString().split('T')[0]
      setFormData(prev => ({ ...prev, start_date: defaultDate || todayISO, end_date: defaultDate || todayISO }));
    }
  }, [initialData, selectedDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.start_date) {
      alert("Title and start date are required.");
      return;
    }
    
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col border border-white/20 dark:border-slate-800 animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 dark:border-slate-800">
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            {initialData ? 'Edit Event' : 'New Event'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-8 flex flex-col gap-6 overflow-y-auto max-h-[75vh]">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Title</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all outline-none dark:text-white font-medium"
              placeholder="Event name"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Description</label>
            <textarea 
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all outline-none dark:text-white resize-none h-24 font-medium"
              placeholder="What's happening?"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Start Date</label>
              <input 
                type="date"
                value={formData.start_date}
                onChange={e => setFormData({...formData, start_date: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all outline-none dark:text-white cursor-pointer font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">End Date</label>
              <input 
                type="date"
                value={formData.end_date}
                onChange={e => setFormData({...formData, end_date: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all outline-none dark:text-white cursor-pointer font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Recurrence</label>
            <select 
              value={formData.recurrence_type}
              onChange={e => setFormData({...formData, recurrence_type: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all outline-none dark:text-white appearance-none cursor-pointer font-medium"
            >
              <option value="none">Single day</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="mt-6 flex justify-end gap-4 pt-6">
            <button 
              type="button" 
              onClick={onClose}
              className="px-8 py-4 rounded-2xl font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              Discard
            </button>
            <button 
              type="submit" 
              className="px-8 py-4 rounded-2xl font-bold text-white bg-blue-500 hover:bg-blue-600 shadow-xl shadow-blue-500/20 transition-all active:scale-95"
            >
              {initialData ? 'Update' : 'Generate Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
