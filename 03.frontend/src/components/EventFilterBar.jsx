import React from 'react';
import clsx from 'clsx';
import { Layers } from 'lucide-react';

export default function EventFilterBar({ mode, setMode }) {
  return (
    <div className="absolute bottom-6 right-6 z-40 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-1.5 rounded-full shadow-lg border border-pink-100 dark:border-slate-700 flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
      <div className="pl-3 pr-2 text-pink-500 dark:text-pink-400">
        <Layers size={18} />
      </div>
      <button 
        onClick={() => setMode('all')}
        className={clsx(
          "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
          mode === 'all' 
            ? "bg-pink-500 text-white shadow-sm" 
            : "text-slate-600 dark:text-slate-300 hover:bg-pink-50 dark:hover:bg-slate-700"
        )}
      >
        All Events
      </button>
      <button 
        onClick={() => setMode('today')}
        className={clsx(
          "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
          mode === 'today' 
            ? "bg-pink-500 text-white shadow-sm" 
            : "text-slate-600 dark:text-slate-300 hover:bg-pink-50 dark:hover:bg-slate-700"
        )}
      >
        Today's Schedule
      </button>
    </div>
  );
}
