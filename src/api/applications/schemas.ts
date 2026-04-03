import { z } from 'zod';

export const applyGatheringFormSchema = z.object({
  personalGoal: z
    .string()
    .min(5, '목표는 최소 5자 이상 입력해 주세요.')
    .max(200, '목표는 최대 200자까지 입력 가능합니다.'),
  selfIntroduction: z.string().max(100, '한 줄 소개는 최대 100자까지 입력 가능합니다.').optional(),
});
