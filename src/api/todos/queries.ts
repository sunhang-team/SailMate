import { queryOptions } from '@tanstack/react-query';

import { getTodoList, getMyTodoList, createTodo, updateTodo, deleteTodo } from './index';
import type { CreateTodoForm, TodoListParams, UpdateTodoForm } from './types';

export const todoKeys = {
  all: (gatheringId: number) => ['todos', gatheringId] as const,
  list: (gatheringId: number, params?: TodoListParams) => [...todoKeys.all(gatheringId), 'list', params ?? {}] as const,
  myList: (gatheringId: number, params?: TodoListParams) => [...todoKeys.all(gatheringId), 'my', params ?? {}] as const,
};

export const todoQueries = {
  /** GET /gatherings/:gatheringId/todos — 모임 전체 Todo 조회 */
  list: (gatheringId: number, params?: TodoListParams) =>
    queryOptions({
      queryKey: todoKeys.list(gatheringId, params),
      queryFn: () => getTodoList(gatheringId, params),
    }),
  /** GET /gatherings/:gatheringId/todos/me — 내 Todo + 달성률 */
  myList: (gatheringId: number, params?: TodoListParams) =>
    queryOptions({
      queryKey: todoKeys.myList(gatheringId, params),
      queryFn: () => getMyTodoList(gatheringId, params),
    }),
};

export const todoMutations = {
  /** POST /gatherings/:gatheringId/todos — Todo 생성 */
  create: (gatheringId: number) => ({
    mutationFn: (body: CreateTodoForm) => createTodo(gatheringId, body),
  }),
  /** PATCH /gatherings/:gatheringId/todos/:todoId — Todo 수정/체크 */
  update: (gatheringId: number, todoId: number) => ({
    mutationFn: (body: UpdateTodoForm) => updateTodo(gatheringId, todoId, body),
  }),
  /** DELETE /gatherings/:gatheringId/todos/:todoId — Todo 삭제 */
  delete: (gatheringId: number, todoId: number) => ({
    mutationFn: () => deleteTodo(gatheringId, todoId),
  }),
};
