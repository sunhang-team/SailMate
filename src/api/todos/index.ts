import { axiosClient } from '@/lib/axiosClient';
import { unwrapResponse } from '@/api/common/utils';

import type { ApiResponse } from '@/api/common/types';
import type {
  TodoListParams,
  TodoListResponse,
  MyTodoListResponse,
  CreateTodoForm,
  CreateTodoResponse,
  UpdateTodoForm,
  UpdateTodoResponse,
} from './types';

/** GET /v1/gatherings/:gatheringId/todos — 모임 전체 Todo 조회 */
export const getTodoList = async (gatheringId: number, params?: TodoListParams): Promise<TodoListResponse> => {
  const { data } = await axiosClient.get<ApiResponse<TodoListResponse>>(`/v1/gatherings/${gatheringId}/todos`, {
    params,
  });
  return unwrapResponse(data);
};

/** GET /v1/gatherings/:gatheringId/todos/me — 내 Todo + 달성률 */
export const getMyTodoList = async (gatheringId: number, params?: TodoListParams): Promise<MyTodoListResponse> => {
  const { data } = await axiosClient.get<ApiResponse<MyTodoListResponse>>(`/v1/gatherings/${gatheringId}/todos/me`, {
    params,
  });
  return unwrapResponse(data);
};

/** POST /v1/gatherings/:gatheringId/todos — Todo 생성 */
export const createTodo = async (gatheringId: number, body: CreateTodoForm): Promise<CreateTodoResponse> => {
  const { data } = await axiosClient.post<ApiResponse<CreateTodoResponse>>(`/v1/gatherings/${gatheringId}/todos`, body);
  return unwrapResponse(data);
};

/** PATCH /v1/gatherings/:gatheringId/todos/:todoId — Todo 수정/체크 */
export const updateTodo = async (
  gatheringId: number,
  todoId: number,
  body: UpdateTodoForm,
): Promise<UpdateTodoResponse> => {
  const { data } = await axiosClient.patch<ApiResponse<UpdateTodoResponse>>(
    `/v1/gatherings/${gatheringId}/todos/${todoId}`,
    body,
  );
  return unwrapResponse(data);
};

/** DELETE /v1/gatherings/:gatheringId/todos/:todoId — Todo 삭제 */
export const deleteTodo = async (gatheringId: number, todoId: number): Promise<void> => {
  await axiosClient.delete(`/v1/gatherings/${gatheringId}/todos/${todoId}`);
};
