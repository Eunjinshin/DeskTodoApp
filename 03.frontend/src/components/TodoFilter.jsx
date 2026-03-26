import React from 'react';
import { Search } from 'lucide-react';

export default function TodoFilter({ filter, setFilter }) {
  return (
    <div className="flex flex-col md:flex-row gap-6 mb-10 bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm shrink-0 transition-all focus-within:shadow-md">
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <Search size={18} />
        </div>
        <input 
          type="text"
          placeholder="Search by tag (e.g. #work)"
          value={filter.tag || ''}
          onChange={e => setFilter({ ...filter, tag: e.target.value })}
          className="w-full pl-11 pr-4 py-3 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all outline-none dark:text-white font-medium"
        />
      </div>

      <div className="flex gap-3 items-center">
        <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</label>
        <select 
          value={filter.completed === undefined ? 'all' : filter.completed ? 'completed' : 'active'}
          onChange={(e) => {
            const val = e.target.value;
            setFilter({ ...filter, completed: val === 'all' ? undefined : val === 'completed' });
          }}
          className="pl-4 pr-10 py-3 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all outline-none dark:target-white appearance-none cursor-pointer font-medium"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      
      <div className="flex gap-3 items-center">
        <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Date</label>
        <input 
          type="date"
          value={filter.date || ''}
          onChange={(e) => setFilter({ ...filter, date: e.target.value })}
          className="pl-4 pr-10 py-3 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all outline-none dark:text-white cursor-pointer font-medium"
        />
        {filter.date && (
          <button 
            onClick={() => setFilter({ ...filter, date: '' })}
            className="text-xs text-pink-500 hover:text-pink-600 ml-1 font-semibold"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
