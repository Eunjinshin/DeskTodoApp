import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
  todos: [],
  loading: false,
  error: null,
};

/**
 * TODO 정렬 함수
 * DB 쿼리와 동일한 기준: 미완료 우선 → 우선순위 내림차순 → 생성일 내림차순
 * 완료된 TODO가 즉시 하단으로 이동하도록 클라이언트에서도 정렬
 */
function sortTodos(todos) {
  return [...todos].sort((a, b) => {
    // 1. 미완료(0) 먼저, 완료(1) 나중
    if (a.is_done !== b.is_done) return a.is_done - b.is_done;
    // 2. 우선순위 높은 것(2) 먼저
    if (a.priority !== b.priority) return b.priority - a.priority;
    // 3. 최근 생성 먼저
    return (b.created_at || '').localeCompare(a.created_at || '');
  });
}

function todoReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };
    case 'SET_TODOS':
      return { ...state, todos: action.payload, loading: false };
    case 'UPDATE_TODO': {
      // 항목 교체 후 정렬 적용 (완료 시 하단 이동)
      const updated = state.todos.map((t) =>
        t.id === action.payload.id ? action.payload : t
      );
      return { ...state, todos: sortTodos(updated), loading: false };
    }
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter((t) => t.id !== action.payload),
        loading: false,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

const TodoContext = createContext();

export function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodoContext() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
}
