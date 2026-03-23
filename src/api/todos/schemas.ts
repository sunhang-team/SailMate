import { z } from 'zod';

/** POST `/gatherings/:gatheringId/todos` — Todo 생성 폼 */
export const createTodoFormSchema = z.object({
  week: z.number().min(1, '주차는 1 이상이어야 합니다.'),
  content: z.string().min(1, '할 일을 입력해 주세요.').max(200, '할 일은 최대 200자까지 가능합니다.'),
});

/** PATCH `/gatherings/:gatheringId/todos/:todoId` — Todo 수정/체크 폼 */
export const updateTodoFormSchema = z.object({
  content: z.string().min(1, '할 일을 입력해 주세요.').max(200, '할 일은 최대 200자까지 가능합니다.').optional(),
  isCompleted: z.boolean().optional(),
});
