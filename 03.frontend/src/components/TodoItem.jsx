import React from 'react';
import { Trash2, Edit2, CheckCircle, Circle, Tag, Calendar as CalIcon } from 'lucide-react';
import clsx from 'clsx';
import { format, parseISO } from 'date-fns';

const priorityColors = {
  high: 'bg-red-500',
  medium: 'bg-yellow-400',
  low: 'bg-white border border-gray-300'
};

export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const isCompleted = todo.completed === 1;

  return (
    <div className={clsx(
      "group flex items-start gap-5 p-5 rounded-2xl border transition-all duration-300",
      isCompleted 
        ? "bg-slate-50/50 border-slate-100 dark:bg-slate-800/20 dark:border-slate-800/50 opacity-75"
        : "bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-0.5"
    )}>
      <div className="pt-1.5 flex flex-col items-center gap-2">
        <div className={clsx("w-2.5 h-2.5 rounded-full ring-4 ring-opacity-10", priorityColors[todo.priority], 
          todo.priority === 'high' ? 'ring-red-500' : todo.priority === 'medium' ? 'ring-yellow-400' : 'ring-slate-300')} />
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <button onClick={() => onToggle(todo)} className="text-pink-500 dark:text-pink-400 hover:text-pink-600 dark:hover:text-pink-300 transition-colors shrink-0">
            {isCompleted ? <CheckCircle size={20} /> : <Circle size={20} />}
          </button>
          
          <h3 className={clsx(
            "text-base font-medium truncate transition-all",
            isCompleted ? "text-slate-400 line-through decoration-slate-300 dark:text-slate-500 dark:decoration-slate-600" : "text-slate-700 dark:text-slate-200"
          )}>
            {todo.title}
          </h3>
        </div>

        {todo.content && (
          <p className={clsx(
            "text-sm mb-3 pl-7",
            isCompleted ? "text-slate-400" : "text-slate-500 dark:text-slate-400"
          )}>
            {todo.content}
          </p>
        )}

        <div className="flex flex-wrap gap-3 pl-7 mt-2 text-xs">
          {todo.due_date && (
            <div className="flex items-center gap-1.5 text-pink-600/80 dark:text-pink-400/80 bg-pink-50 dark:bg-pink-900/30 px-2.5 py-1 rounded-md font-medium">
              <CalIcon size={12} />
              <span>{format(parseISO(todo.due_date), 'MMM d, yyyy')}</span>
            </div>
          )}

          {todo.tags && todo.tags.split(',').map((tag, idx) => {
            const trimmed = tag.trim();
            if (!trimmed) return null;
            return (
              <div key={idx} className="flex items-center gap-1 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">
                <Tag size={10} />
                <span>{trimmed}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(todo)} className="p-2 text-slate-400 hover:text-blue-500 transition-colors rounded-full hover:bg-blue-50 dark:hover:bg-slate-700">
          <Edit2 size={16} />
        </button>
        <button onClick={() => onDelete(todo.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50 dark:hover:bg-slate-700">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
