import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { getTodoList, getMyTodoList, createTodo, updateTodo, deleteTodo } from './index';

import type { UseMutationOptions } from '@tanstack/react-query';
import type { CreateTodoForm, CreateTodoResponse, UpdateTodoForm, UpdateTodoResponse, TodoListParams } from './types';
import { membershipQueries } from '../memberships/queries';
import { achievementKeys } from '../achievements/queries';

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

/** POST /gatherings/:gatheringId/todos — Todo 생성 */
export const useCreateTodo = (
  gatheringId: number,
  options?: UseMutationOptions<CreateTodoResponse, Error, CreateTodoForm, unknown>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateTodoForm) => createTodo(gatheringId, body),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all(gatheringId) });
      queryClient.invalidateQueries({ queryKey: membershipQueries.members(gatheringId).queryKey });
      queryClient.invalidateQueries({ queryKey: achievementKeys.all(gatheringId) });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

/** PATCH /gatherings/:gatheringId/todos/:todoId — Todo 수정/체크 */
export const useUpdateTodo = (
  gatheringId: number,
  options?: UseMutationOptions<UpdateTodoResponse, Error, { todoId: number; body: UpdateTodoForm }, unknown>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ todoId, body }: { todoId: number; body: UpdateTodoForm }) => updateTodo(gatheringId, todoId, body),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all(gatheringId) });
      queryClient.invalidateQueries({ queryKey: membershipQueries.members(gatheringId).queryKey });
      queryClient.invalidateQueries({ queryKey: achievementKeys.all(gatheringId) });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

/** DELETE /gatherings/:gatheringId/todos/:todoId — Todo 삭제 */
export const useDeleteTodo = (gatheringId: number, options?: UseMutationOptions<void, Error, number, unknown>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (todoId: number) => deleteTodo(gatheringId, todoId),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all(gatheringId) });
      queryClient.invalidateQueries({ queryKey: membershipQueries.members(gatheringId).queryKey });
      queryClient.invalidateQueries({ queryKey: achievementKeys.all(gatheringId) });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
