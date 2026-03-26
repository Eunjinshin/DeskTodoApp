import React, { useState, useEffect } from 'react';
import TitleBar from './components/TitleBar';
import Settings from './components/Settings';
import TodoPage from './pages/TodoPage';
import CalendarPage from './pages/CalendarPage';

export default function App() {
  const [theme, setTheme] = useState('light');
  const [opacity, setOpacity] = useState(1.0);
  const [isPinned, setIsPinned] = useState(false);
  const [activeTab, setActiveTab] = useState('todo'); // 'todo', 'calendar', 'settings'

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleOpacityChange = (val) => {
    setOpacity(val);
    window.electronAPI?.setOpacity(val);
  };

  const togglePin = () => {
    const next = !isPinned;
    setIsPinned(next);
    window.electronAPI?.togglePin(next);
  };

  return (
    /* Window Wrapper with Border */
    <div className="w-full h-screen p-1 bg-slate-100 dark:bg-slate-900 overflow-hidden">
      <div className="w-full h-full flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden relative">
        <TitleBar isPinned={isPinned} togglePin={togglePin} />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Navigation */}
          <aside className="w-20 flex flex-col items-center py-6 space-y-6 bg-slate-50/50 dark:bg-slate-800/50 border-r border-slate-100 dark:border-slate-800/50 backdrop-blur-xl">
            <button 
              onClick={() => setActiveTab('todo')} 
              className={`group relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${activeTab === 'todo' ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-pink-500 dark:hover:text-pink-400'}`}
              title="Tasks"
            >
              <span className="font-bold text-xl">✓</span>
              {activeTab === 'todo' && <div className="absolute -left-4 w-1.5 h-8 bg-pink-500 rounded-r-full" />}
            </button>
            
            <button 
              onClick={() => setActiveTab('calendar')} 
              className={`group relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${activeTab === 'calendar' ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-pink-500 dark:hover:text-pink-400'}`}
              title="Calendar"
            >
              <span className="font-bold text-xl">📅</span>
              {activeTab === 'calendar' && <div className="absolute -left-4 w-1.5 h-8 bg-pink-500 rounded-r-full" />}
            </button>
            
            <div className="flex-1" />
            
            <button 
              onClick={() => setActiveTab('settings')} 
              className={`group relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${activeTab === 'settings' ? 'bg-slate-800 text-white dark:bg-slate-700' : 'text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-200'}`}
              title="Settings"
            >
              <span className="font-bold text-xl">⚙</span>
              {activeTab === 'settings' && <div className="absolute -left-4 w-1.5 h-8 bg-slate-800 dark:bg-slate-400 rounded-r-full" />}
            </button>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 bg-[#fdfbfd] dark:bg-slate-950 p-8 overflow-y-auto relative">
            <div className="max-w-5xl mx-auto h-full flex flex-col">
              {activeTab === 'todo' && (
                <TodoPage />
              )}
              {activeTab === 'calendar' && (
                <CalendarPage />
              )}
              {activeTab === 'settings' && (
                <div className="w-full">
                  <Settings 
                    opacity={opacity} 
                    setOpacity={handleOpacityChange} 
                    theme={theme} 
                    toggleTheme={toggleTheme} 
                  />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
