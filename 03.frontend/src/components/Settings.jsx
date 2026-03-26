import React from 'react';

export default function Settings({ 
  opacity, 
  setOpacity, 
  theme, 
  toggleTheme 
}) {
  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-pink-100 dark:border-slate-700 mb-6">
      <h2 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-100">Settings</h2>
      
      <div className="flex flex-col space-y-4 text-slate-800 dark:text-slate-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Dark Mode</span>
          <button 
            onClick={toggleTheme}
            className={`w-12 h-6 rounded-full transition-colors relative ${theme === 'dark' ? 'bg-pink-500' : 'bg-gray-300 dark:bg-slate-600'}`}
          >
            <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Window Opacity</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{Math.round(opacity * 100)}%</span>
          </div>
          <input 
            type="range" 
            min="0.3" 
            max="1.0" 
            step="0.05"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-pink-500"
          />
        </div>
      </div>
    </div>
  );
}
