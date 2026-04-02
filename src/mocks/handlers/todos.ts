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
  // userId 1 (김코딩) — week 1: 5/5 = 100%
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
    content: 'TanStack Query v5 마이그레이션 정리',
    isCompleted: true,
    createdAt: '2025-03-22T10:00:00Z',
  },
  {
    id: 3,
    userId: 1,
    nickname: '김코딩',
    week: 1,
    content: 'Zustand 상태 관리 패턴 학습',
    isCompleted: true,
    createdAt: '2025-03-22T11:00:00Z',
  },
  {
    id: 4,
    userId: 1,
    nickname: '김코딩',
    week: 1,
    content: 'Next.js App Router 구조 파악',
    isCompleted: true,
    createdAt: '2025-03-22T13:00:00Z',
  },
  {
    id: 5,
    userId: 1,
    nickname: '김코딩',
    week: 1,
    content: 'TypeScript strict 모드 설정 복습',
    isCompleted: true,
    createdAt: '2025-03-22T14:00:00Z',
  },

  // userId 1 (김코딩) — week 2: 4/5 = 80%
  {
    id: 6,
    userId: 1,
    nickname: '김코딩',
    week: 2,
    content: 'MSW로 API 모킹 구현',
    isCompleted: true,
    createdAt: '2025-03-29T09:00:00Z',
  },
  {
    id: 7,
    userId: 1,
    nickname: '김코딩',
    week: 2,
    content: 'react-hook-form + Zod 연동',
    isCompleted: true,
    createdAt: '2025-03-29T10:00:00Z',
  },
  {
    id: 8,
    userId: 1,
    nickname: '김코딩',
    week: 2,
    content: 'TailwindCSS v4 변경사항 정리',
    isCompleted: true,
    createdAt: '2025-03-29T11:00:00Z',
  },
  {
    id: 9,
    userId: 1,
    nickname: '김코딩',
    week: 2,
    content: 'Storybook 컴포넌트 문서화',
    isCompleted: true,
    createdAt: '2025-03-29T13:00:00Z',
  },
  {
    id: 10,
    userId: 1,
    nickname: '김코딩',
    week: 2,
    content: 'ErrorBoundary 패턴 정리',
    isCompleted: false,
    createdAt: '2025-03-29T14:00:00Z',
  },

  // userId 2 (이개발) — week 1: 4/5 = 80%
  {
    id: 11,
    userId: 2,
    nickname: '이개발',
    week: 1,
    content: 'Axios 인터셉터 구현',
    isCompleted: true,
    createdAt: '2025-03-23T09:00:00Z',
  },
  {
    id: 12,
    userId: 2,
    nickname: '이개발',
    week: 1,
    content: 'fetch vs axios 차이 정리',
    isCompleted: true,
    createdAt: '2025-03-23T10:00:00Z',
  },
  {
    id: 13,
    userId: 2,
    nickname: '이개발',
    week: 1,
    content: 'Server Action 실습',
    isCompleted: true,
    createdAt: '2025-03-23T11:00:00Z',
  },
  {
    id: 14,
    userId: 2,
    nickname: '이개발',
    week: 1,
    content: 'Next.js 캐싱 전략 학습',
    isCompleted: true,
    createdAt: '2025-03-23T13:00:00Z',
  },
  {
    id: 15,
    userId: 2,
    nickname: '이개발',
    week: 1,
    content: 'HydrationBoundary 사용법 익히기',
    isCompleted: false,
    createdAt: '2025-03-23T14:00:00Z',
  },

  // userId 2 (이개발) — week 2: 3/5 = 60%
  {
    id: 16,
    userId: 2,
    nickname: '이개발',
    week: 2,
    content: 'CVA로 버튼 컴포넌트 리팩터링',
    isCompleted: true,
    createdAt: '2025-03-30T09:00:00Z',
  },
  {
    id: 17,
    userId: 2,
    nickname: '이개발',
    week: 2,
    content: 'Suspense Boundary 적용',
    isCompleted: true,
    createdAt: '2025-03-30T10:00:00Z',
  },
  {
    id: 18,
    userId: 2,
    nickname: '이개발',
    week: 2,
    content: 'queryKey 팩토리 패턴 정리',
    isCompleted: true,
    createdAt: '2025-03-30T11:00:00Z',
  },
  {
    id: 19,
    userId: 2,
    nickname: '이개발',
    week: 2,
    content: 'prefetchQuery 실습',
    isCompleted: false,
    createdAt: '2025-03-30T13:00:00Z',
  },
  {
    id: 20,
    userId: 2,
    nickname: '이개발',
    week: 2,
    content: '낙관적 업데이트 구현',
    isCompleted: false,
    createdAt: '2025-03-30T14:00:00Z',
  },

  // userId 3 (박디자인) — week 1: 3/5 = 60%
  {
    id: 21,
    userId: 3,
    nickname: '박디자인',
    week: 1,
    content: 'Figma 컴포넌트 라이브러리 구성',
    isCompleted: true,
    createdAt: '2025-03-24T09:00:00Z',
  },
  {
    id: 22,
    userId: 3,
    nickname: '박디자인',
    week: 1,
    content: 'TailwindCSS 디자인 토큰 설정',
    isCompleted: true,
    createdAt: '2025-03-24T10:00:00Z',
  },
  {
    id: 23,
    userId: 3,
    nickname: '박디자인',
    week: 1,
    content: 'Storybook 디자인 시스템 문서화',
    isCompleted: true,
    createdAt: '2025-03-24T11:00:00Z',
  },
  {
    id: 24,
    userId: 3,
    nickname: '박디자인',
    week: 1,
    content: 'clsx + tailwind-merge 활용법 정리',
    isCompleted: false,
    createdAt: '2025-03-24T13:00:00Z',
  },
  {
    id: 25,
    userId: 3,
    nickname: '박디자인',
    week: 1,
    content: '반응형 레이아웃 패턴 학습',
    isCompleted: false,
    createdAt: '2025-03-24T14:00:00Z',
  },

  // userId 3 (박디자인) — week 2: 5/5 = 100%
  {
    id: 26,
    userId: 3,
    nickname: '박디자인',
    week: 2,
    content: 'SVG 아이콘 컴포넌트화',
    isCompleted: true,
    createdAt: '2025-03-31T09:00:00Z',
  },
  {
    id: 27,
    userId: 3,
    nickname: '박디자인',
    week: 2,
    content: '다크모드 CSS 변수 설계',
    isCompleted: true,
    createdAt: '2025-03-31T10:00:00Z',
  },
  {
    id: 28,
    userId: 3,
    nickname: '박디자인',
    week: 2,
    content: '접근성(a11y) 체크리스트 작성',
    isCompleted: true,
    createdAt: '2025-03-31T11:00:00Z',
  },
  {
    id: 29,
    userId: 3,
    nickname: '박디자인',
    week: 2,
    content: '애니메이션 트랜지션 구현',
    isCompleted: true,
    createdAt: '2025-03-31T13:00:00Z',
  },
  {
    id: 30,
    userId: 3,
    nickname: '박디자인',
    week: 2,
    content: 'framer-motion 기초 학습',
    isCompleted: true,
    createdAt: '2025-03-31T14:00:00Z',
  },
];

const BASE = '/api/v1/gatherings/:gatheringId/todos';

export const todosHandlers = [
  /** GET /api/v1/gatherings/:gatheringId/todos/me — 내 Todo + 달성률 */
  http.get(`${BASE}/me`, async ({ request }) => {
    await delay(300);

    const url = new URL(request.url);
    const week = url.searchParams.get('week');

    const myTodos = mockTodos.filter((todo) => todo.userId === 1);
    const filteredTodos = week ? myTodos.filter((todo) => todo.week === Number(week)) : myTodos;

    const overallCompleted = myTodos.filter((todo) => todo.isCompleted).length;
    const weeklyCompleted = filteredTodos.filter((todo) => todo.isCompleted).length;

    const overallAchievementRate =
      myTodos.length > 0 ? Math.round((overallCompleted / myTodos.length) * 100 * 10) / 10 : 0;
    const weeklyAchievementRate =
      filteredTodos.length > 0 ? Math.round((weeklyCompleted / filteredTodos.length) * 100 * 10) / 10 : 0;

    return HttpResponse.json(
      createApiResponse<MyTodoListResponse>({
        todos: filteredTodos,
        weeklyAchievementRate,
        overallAchievementRate,
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
