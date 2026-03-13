/**
 * TODO CRUD 커스텀 Hook
 *
 * [커스텀 Hook이란?]
 * 여러 컴포넌트에서 공통으로 사용하는 상태 로직을 하나의 함수로 추출한 것입니다.
 * "use"로 시작해야 React가 Hook으로 인식합니다.
 *
 * [이 Hook의 역할]
 * - todoApi를 호출하여 Main Process와 통신합니다.
 * - 결과를 TodoContext에 dispatch하여 전역 상태를 업데이트합니다.
 * - 로딩, 에러 상태를 자동 관리합니다.
 */
import { useCallback, useEffect } from 'react';
import { useTodoContext } from '../context/TodoContext';
import * as todoApi from '../api/todoApi';

export function useTodos() {
  const { state, dispatch } = useTodoContext();

  /**
   * TODO 목록 로드
   *
   * [useCallback이란?]
   * 함수를 메모이제이션(캐싱)하여, 의존성이 변하지 않으면
   * 같은 함수 참조를 재사용합니다.
   * → 불필요한 리렌더링을 방지합니다.
   */
  const loadTodos = useCallback(async () => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const todos = await todoApi.listTodos();
      dispatch({ type: 'SET_TODOS', payload: todos });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, [dispatch]);

  /**
   * TODO 생성
   * @param {{ title: string, content?: string, priority?: number, dueDate?: string }} data
   */
  const addTodo = useCallback(async (data) => {
    try {
      await todoApi.createTodo(data);
      // [P6] ADD_TODO 대신 전체 재로드 → DB 정렬(priority DESC)과 일치
      await loadTodos();
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, [dispatch, loadTodos]);

  /**
   * TODO 수정
   * @param {Object} data - { id, ...수정할 필드 }
   */
  const editTodo = useCallback(async (data) => {
    try {
      const todo = await todoApi.updateTodo(data);
      dispatch({ type: 'UPDATE_TODO', payload: todo });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, [dispatch]);

  /**
   * TODO 삭제
   * @param {string} id - TODO ID
   */
  const removeTodo = useCallback(async (id) => {
    try {
      await todoApi.deleteTodo(id);
      dispatch({ type: 'DELETE_TODO', payload: id });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, [dispatch]);

  /**
   * TODO 완료/미완료 토글
   * @param {Object} todo - 전체 TODO 객체
   */
  const toggleTodo = useCallback(async (todo) => {
    try {
      const updated = await todoApi.updateTodo({
        id: todo.id,
        isDone: !todo.is_done,
      });
      dispatch({ type: 'UPDATE_TODO', payload: updated });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, [dispatch]);

  /** 에러 초기화 */
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, [dispatch]);

  /**
   * 컴포넌트 마운트 시 TODO 목록 자동 로드
   *
   * [useEffect란?]
   * 컴포넌트가 화면에 나타난 후 실행되는 부수 효과(side effect)입니다.
   * 빈 배열 []을 전달하면 최초 1회만 실행됩니다.
   */
  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  return {
    todos: state.todos,
    loading: state.loading,
    error: state.error,
    loadTodos,
    addTodo,
    editTodo,
    removeTodo,
    toggleTodo,
    clearError,
  };
}
