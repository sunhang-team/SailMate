import { z } from 'zod';

/** 날짜 문자열 스키마 (YYYY-MM-DD) */
const dateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)');

/** 주차별 가이드 스키마 (모임 생성 폼용) */
export const weeklyGuideSchema = z.object({
  week: z.number().min(1, '주차는 1 이상이어야 합니다.'),
  title: z.string().min(1, '주제는 필수 입력입니다.'),
  content: z.string().min(1, '내용은 필수 입력입니다.'),
});

/** POST `/gatherings` — 모임 생성 폼 */
export const gatheringFormSchema = z.object({
  type: z.enum(['스터디', '프로젝트'], {
    message: '모임 유형을 지정해 주세요.',
  }),
  category: z.string().min(1, '카테고리를 선택해 주세요.'),
  title: z.string().min(1, '모임 제목을 입력해 주세요. ').max(30, '제목은 최대 30자까지 가능합니다.'),
  shortDescription: z.string().min(1, '한 줄 소개를 입력해 주세요.').max(50, '한 줄 소개는 최대 50자까지 가능합니다.'),
  description: z.string().min(1, '상세 소개를 입력해 주세요.').max(1000, '상세 설명은 최대 1000자까지 가능합니다.'),
  tags: z.array(z.string()).min(1, '최소 1개의 태그를 입력해 주세요.').max(5, '태그는 최대 5개까지 가능합니다.'),
  goal: z.string().min(1, '모임 목표를 입력해 주세요.').max(200, '모임 목표는 최대 200자까지 가능합니다.'),
  maxMembers: z.number().min(2, '최소 2명 이상이어야 합니다.').max(20, '최대 20명 이하이어야 합니다.'),
  recruitDeadline: dateStringSchema,
  startDate: dateStringSchema,
  endDate: dateStringSchema,
  weeklyGuides: z.array(weeklyGuideSchema).min(1, '최소 1주차 계획은 입력해 주세요.'),
  images: z
    .array(z.instanceof(File, { message: '유효한 파일이 아닙니다.' }))
    .max(6, '이미지는 최대 6장까지 업로드 가능합니다.')
    .optional(),
});

/** PUT `/gatherings/:gatheringId` — 모임 수정 폼 (모든 필드 optional) */
export const gatheringUpdateFormSchema = gatheringFormSchema.partial();

/** POST `/gatherings` — 모임 생성 폼 (부분 구현용) */
export const gatheringFormPartialSchema = z.object({
  type: z.enum(['스터디', '프로젝트'], { message: '모임 유형을 지정해 주세요.' }),
  category: z.string().min(1, '카테고리를 선택해 주세요.'),
  title: z.string().min(1, '모임 제목을 입력해 주세요. ').max(30, '제목은 최대 30자까지 가능합니다.'),
  shortDescription: z.string().min(1, '한 줄 소개를 입력해 주세요.').max(50, '한 줄 소개는 최대 50자까지 가능합니다.'),
  description: z.string().min(1, '상세 소개를 입력해 주세요.').max(1000, '상세 설명은 최대 1000자까지 가능합니다.'),
  tags: z.array(z.string()).min(1, '최소 1개의 태그를 입력해 주세요.').max(5, '태그는 최대 5개까지 가능합니다.'),
  goal: z.string().min(1, '모임 목표를 입력해 주세요.').max(200, '모임 목표는 최대 200자까지 가능합니다.'),
});
