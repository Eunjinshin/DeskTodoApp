import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function TodoForm({ initialData, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'low',
    due_date: '',
    tags: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        priority: initialData.priority || 'low',
        due_date: initialData.due_date || '',
        tags: initialData.tags || ''
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("제목은 필수 입력입니다.");
      return;
    }
    
    const tagsArray = formData.tags.split(',').map(t => {
      let tr = t.trim();
      if(tr && !tr.startsWith('#')) tr = '#' + tr;
      return tr;
    }).filter(Boolean);

    onSave({
      ...formData,
      tags: tagsArray.join(', ')
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col border border-white/20 dark:border-slate-800 animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 dark:border-slate-800">
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            {initialData ? 'Edit Task' : 'New Task'}
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
              placeholder="What needs to be done?"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Description</label>
            <textarea 
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all outline-none dark:text-white resize-none h-32 font-medium"
              placeholder="Add some more context..."
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Priority</label>
              <select 
                value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all outline-none dark:text-white appearance-none cursor-pointer font-medium"
              >
                <option value="high">Critical</option>
                <option value="medium">Normal</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Due Date</label>
              <input 
                type="date"
                min={new Date().toISOString().split('T')[0]} 
                value={formData.due_date}
                onChange={e => setFormData({...formData, due_date: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all outline-none dark:text-white cursor-pointer font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Tags</label>
            <input 
              type="text" 
              value={formData.tags}
              onChange={e => setFormData({...formData, tags: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all outline-none dark:text-white font-medium"
              placeholder="e.g. work, leisure"
            />
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
              className="px-8 py-4 rounded-2xl font-bold text-white bg-pink-500 hover:bg-pink-600 shadow-xl shadow-pink-500/20 transition-all active:scale-95"
            >
              {initialData ? 'Update' : 'Generate Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
