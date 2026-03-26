import React from 'react';
import { Minus, Square, X, Pin } from 'lucide-react';
import clsx from 'clsx';

export default function TitleBar({ isPinned, togglePin }) {
  const electronAPI = window.electronAPI;

  return (
    <div className="h-11 w-full flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/50 draggable overflow-hidden shrink-0">
      <div className="flex items-center space-x-3 pl-5">
        <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
        <span className="font-bold text-xs tracking-widest text-slate-400 dark:text-slate-500 uppercase select-none">WeGet TODO</span>
      </div>
      
      <div className="flex bg-transparent h-full non-draggable">
        <button 
          onClick={togglePin}
          className={clsx(
            "h-full px-5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center",
            isPinned && "text-pink-500"
          )}
          title="Always on Top"
        >
          <Pin size={15} />
        </button>
        <button 
          onClick={() => electronAPI?.minimize()}
          className="h-full px-5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center text-slate-500"
        >
          <Minus size={16} />
        </button>
        <button 
          onClick={() => electronAPI?.toggleMaximize()}
          className="h-full px-5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center text-slate-500"
        >
          <Square size={13} />
        </button>
        <button 
          onClick={() => electronAPI?.close()}
          className="h-full px-5 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center text-slate-500"
        >
          <X size={17} />
        </button>
      </div>
    </div>
  );
}
