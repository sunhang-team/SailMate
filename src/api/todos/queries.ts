import { queryOptions } from '@tanstack/react-query';

import { getTodoList, getMyTodoList } from './index';
import type { TodoListParams } from './types';

export const todoKeys = {
  all: (gatheringId: number) => ['todos', gatheringId] as const,
  list: (gatheringId: number, params?: TodoListParams) => [...todoKeys.all(gatheringId), 'list', params ?? {}] as const,
  myList: (gatheringId: number, params?: TodoListParams) => [...todoKeys.all(gatheringId), 'my', params ?? {}] as const,
};

export const todoQueries = {
  list: (gatheringId: number, params?: TodoListParams) =>
    queryOptions({
      queryKey: todoKeys.list(gatheringId, params),
      queryFn: () => getTodoList(gatheringId, params),
    }),
  myList: (gatheringId: number, params?: TodoListParams) =>
    queryOptions({
      queryKey: todoKeys.myList(gatheringId, params),
      queryFn: () => getMyTodoList(gatheringId, params),
    }),
};
