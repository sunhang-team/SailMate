import type { z } from 'zod';

import type { createTodoFormSchema, updateTodoFormSchema } from './schemas';

/** POST `/gatherings/:gatheringId/todos` — Todo 생성 폼 */
export type CreateTodoForm = z.infer<typeof createTodoFormSchema>;

/** PATCH `/gatherings/:gatheringId/todos/:todoId` — Todo 수정/체크 폼 */
export type UpdateTodoForm = z.infer<typeof updateTodoFormSchema>;

/** GET `/gatherings/:gatheringId/todos` — 모임 전체 Todo 조회 시 개별 Todo */
export interface Todo {
  id: number;
  userId: number;
  nickname: string;
  week: number;
  content: string;
  isCompleted: boolean;
  createdAt: string;
}

// 요청 타입
/** POST `/gatherings/:gatheringId/todos` — Todo 생성 요청 바디 */
export interface CreateTodoRequest {
  week: number;
  content: string;
}

/** PATCH `/gatherings/:gatheringId/todos/:todoId` — Todo 수정 요청 바디 */
export interface UpdateTodoRequest {
  content?: string;
  isCompleted?: boolean;
}

/** GET `/gatherings/:gatheringId/todos` — 쿼리 파라미터 */
export interface TodoListParams {
  week?: number;
}

// 응답 타입
/** GET `/gatherings/:gatheringId/todos` — 모임 전체 Todo 조회 응답 */
export interface TodoListResponse {
  todos: Todo[];
}

/** GET `/gatherings/:gatheringId/todos/me` — 내 Todo + 달성률 응답 */
export interface MyTodoListResponse {
  todos: Todo[];
  weeklyAchievementRate: number;
  overallAchievementRate: number;
}

/** POST `/gatherings/:gatheringId/todos` — Todo 생성 응답 내 todo 객체 */
export interface CreatedTodo {
  id: number;
  week: number;
  content: string;
  isCompleted: boolean;
  createdAt: string;
}

/** POST `/gatherings/:gatheringId/todos` — Todo 생성 응답 */
export interface CreateTodoResponse {
  todo: CreatedTodo;
}

/** PATCH `/gatherings/:gatheringId/todos/:todoId` — Todo 수정 응답 내 todo 객체 */
export interface UpdatedTodo {
  id: number;
  content: string;
  isCompleted: boolean;
}

/** PATCH `/gatherings/:gatheringId/todos/:todoId` — Todo 수정 응답 */
export interface UpdateTodoResponse {
  todo: UpdatedTodo;
}
