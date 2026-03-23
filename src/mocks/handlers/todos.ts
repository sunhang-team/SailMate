import { http, HttpResponse, delay } from 'msw';

import { createApiResponse } from '../utils';

import type {
  Todo,
  TodoListResponse,
  MyTodoListResponse,
  CreateTodoResponse,
  UpdateTodoResponse,
} from '@/api/todos/types';

let mockTodos: Todo[] = [
  {
    id: 1,
    userId: 1,
    nickname: '김코딩',
    week: 1,
    content: 'React 19 공식 문서 읽기',
    isCompleted: true,
    createdAt: '2025-03-22T09:00:00Z',
  },
  {
    id: 2,
    userId: 1,
    nickname: '김코딩',
    week: 1,
    content: 'TanStack Query v5 마이그레이션 가이드 정리',
    isCompleted: false,
    createdAt: '2025-03-22T10:00:00Z',
  },
  {
    id: 3,
    userId: 2,
    nickname: '이개발',
    week: 1,
    content: 'Zustand 상태 관리 패턴 학습',
    isCompleted: false,
    createdAt: '2025-03-23T09:00:00Z',
  },
  {
    id: 4,
    userId: 1,
    nickname: '김코딩',
    week: 2,
    content: 'MSW로 API 모킹 구현',
    isCompleted: false,
    createdAt: '2025-03-29T09:00:00Z',
  },
];

const BASE = '/api/v1/gatherings/:gatheringId/todos';

export const todosHandlers = [
  /** GET /api/v1/gatherings/:gatheringId/todos/me — 내 Todo + 달성률 */
  http.get(`${BASE}/me`, async () => {
    await delay(300);

    const myTodos = mockTodos.filter((todo) => todo.userId === 1);
    const completed = myTodos.filter((todo) => todo.isCompleted).length;

    return HttpResponse.json(
      createApiResponse<MyTodoListResponse>({
        todos: myTodos,
        weeklyAchievementRate: Math.round((completed / myTodos.length) * 100 * 10) / 10,
        overallAchievementRate: Math.round((completed / myTodos.length) * 100 * 10) / 10,
      }),
    );
  }),

  /** GET /api/v1/gatherings/:gatheringId/todos — 모임 전체 Todo 조회 */
  http.get(BASE, async ({ request }) => {
    await delay(300);

    const url = new URL(request.url);
    const week = url.searchParams.get('week');

    const todos = week ? mockTodos.filter((todo) => todo.week === Number(week)) : mockTodos;

    return HttpResponse.json(createApiResponse<TodoListResponse>({ todos }));
  }),

  /** POST /api/v1/gatherings/:gatheringId/todos — Todo 생성 */
  http.post(BASE, async ({ request }) => {
    await delay(200);

    const body = (await request.json()) as { week: number; content: string };
    const newTodo: Todo = {
      id: Date.now(),
      userId: 1,
      nickname: '김코딩',
      week: body.week,
      content: body.content,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };
    mockTodos.push(newTodo);

    return HttpResponse.json(
      createApiResponse<CreateTodoResponse>({
        todo: {
          id: newTodo.id,
          week: newTodo.week,
          content: newTodo.content,
          isCompleted: newTodo.isCompleted,
          createdAt: newTodo.createdAt,
        },
      }),
      { status: 201 },
    );
  }),

  /** PATCH /api/v1/gatherings/:gatheringId/todos/:todoId — Todo 수정/체크 */
  http.patch(`${BASE}/:todoId`, async ({ request, params }) => {
    await delay(200);

    const body = (await request.json()) as { content?: string; isCompleted?: boolean };
    const todoId = Number(params.todoId);
    const todo = mockTodos.find((t) => t.id === todoId);

    if (todo) {
      if (body.content !== undefined) todo.content = body.content;
      if (body.isCompleted !== undefined) todo.isCompleted = body.isCompleted;
    }

    return HttpResponse.json(
      createApiResponse<UpdateTodoResponse>({
        todo: {
          id: todoId,
          content: todo?.content ?? body.content ?? '',
          isCompleted: todo?.isCompleted ?? body.isCompleted ?? false,
        },
      }),
    );
  }),

  /** DELETE /api/v1/gatherings/:gatheringId/todos/:todoId — Todo 삭제 */
  http.delete(`${BASE}/:todoId`, async ({ params }) => {
    await delay(200);

    const todoId = Number(params.todoId);
    mockTodos = mockTodos.filter((t) => t.id !== todoId);

    return new HttpResponse(null, { status: 204 });
  }),
];
