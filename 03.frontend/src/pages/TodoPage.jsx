import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { ipc } from '../lib/ipc';
import TodoItem from '../components/TodoItem';
import TodoForm from '../components/TodoForm';
import TodoFilter from '../components/TodoFilter';

export default function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  const loadTodos = async () => {
    try {
      const data = await ipc.getTodos(filter);
      setTodos(data);
    } catch (err) {
      console.error('Failed to load todos', err);
    }
  };

  useEffect(() => {
    loadTodos();
  }, [filter]);

  const handleToggle = async (todo) => {
    await ipc.updateTodo(todo.id, { completed: todo.completed ? 0 : 1 });
    loadTodos();
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this TODO?')) {
      await ipc.deleteTodo(id);
      loadTodos();
    }
  };

  const handleSave = async (todoData) => {
    if (editingTodo) {
      await ipc.updateTodo(editingTodo.id, todoData);
    } else {
      await ipc.createTodo(todoData);
    }
    setIsFormOpen(false);
    setEditingTodo(null);
    loadTodos();
  };

  const openEdit = (todo) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  const openNew = () => {
    setEditingTodo(null);
    setIsFormOpen(true);
  };

  return (
    <div className="h-full flex flex-col w-full">
      <div className="flex justify-between items-end mb-8 shrink-0">
        <div>
          <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Tasks</h1>
          <p className="text-slate-400 dark:text-slate-500 mt-1 font-medium">Elevate your daily productivity.</p>
        </div>
        <button 
          onClick={openNew}
          className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-full font-medium shadow-lg shadow-pink-500/30 transition-transform active:scale-95"
        >
          <Plus size={20} />
          <span>New Task</span>
        </button>
      </div>

      <TodoFilter filter={filter} setFilter={setFilter} />

      <div className="flex-1 overflow-y-auto pb-6 pr-2">
        {todos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400">
            <p className="text-lg font-medium">No tasks found.</p>
            <p className="text-sm">Create a new task or adjust your filters.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {todos.map(todo => (
              <TodoItem 
                key={todo.id} 
                todo={todo} 
                onToggle={handleToggle}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {isFormOpen && (
        <TodoForm 
          initialData={editingTodo}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
