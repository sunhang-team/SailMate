import { format } from 'date-fns';
import { z } from 'zod';

/** 날짜 문자열 스키마 (YYYY-MM-DD) */
const dateStringSchema = (requiredMessage: string) =>
  z.string({ error: requiredMessage }).regex(/^\d{4}-\d{2}-\d{2}$/, '날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)');

/** 주차별 가이드 스키마 (모임 생성 폼용) */
export const weeklyGuideSchema = z.object({
  week: z.number().min(1, '주차는 1 이상이어야 합니다.'),
  title: z.string().min(1, '제목을 입력해주세요.').max(100, '제목은 최대 100자까지 가능합니다.'),
  details: z
    .array(z.string().max(200, '세부 계획은 200자 이하여야 합니다.'))
    .max(2, '세부 계획은 최대 2개까지 입력할 수 있습니다.')
    .optional(),
});

/** 모임 생성/수정 폼 공통 필드 (cross-field 검증 전 base) */
export const gatheringFormBaseSchema = z.object({
  type: z.enum(['스터디', '프로젝트'], {
    message: '모임 유형을 지정해 주세요.',
  }),
  categoryIds: z
    .array(z.number())
    .min(1, '카테고리를 최소 1개 선택해 주세요.')
    .max(3, '카테고리는 최대 3개까지 선택 가능합니다.'),
  title: z.string().min(2, '제목은 2자 이상이어야 합니다.').max(30, '제목은 최대 30자까지 가능합니다.'),
  shortDescription: z
    .string()
    .min(2, '한 줄 소개는 2자 이상이어야 합니다.')
    .max(50, '한 줄 소개는 최대 50자까지 가능합니다.'),
  description: z
    .string()
    .min(10, '상세 설명은 10자 이상이어야 합니다.')
    .max(1000, '상세 설명은 최대 1000자까지 가능합니다.'),
  tags: z
    .array(z.string().max(15, '태그는 15자 이내로 입력해 주세요.'))
    .max(10, '태그는 최대 10개까지 가능합니다.')
    .optional(),
  goal: z.string().min(1, '모임 목표를 입력해 주세요.').max(200, '모임 목표는 최대 200자까지 가능합니다.'),
  maxMembers: z
    .number({ error: '모집 인원을 입력해주세요.' })
    .min(2, '최소 2명 이상이어야 합니다.')
    .max(10, '최대 10명 이하이어야 합니다.'),
  recruitDeadline: dateStringSchema('모집 마감일을 선택해주세요.'),
  startDate: dateStringSchema('모임 시작일을 선택해주세요.'),
  endDate: dateStringSchema('모임 종료일을 선택해주세요.'),
  weeklyGuides: z.array(weeklyGuideSchema).min(1, '최소 1주차 계획은 입력해 주세요.'),
  images: z
    .array(z.instanceof(File, { message: '유효한 파일이 아닙니다.' }))
    .max(6, '이미지는 최대 6장까지 업로드 가능합니다.')
    .optional(),
});

/** 날짜 크로스필드 검증 스키마 — 필드 검증은 base schema에 위임, 여기서는 cross-field 검증만 담당 */
const dateRefinementSchema = z
  .object({
    recruitDeadline: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const today = format(new Date(), 'yyyy-MM-dd');

    if (data.recruitDeadline && data.recruitDeadline < today) {
      ctx.addIssue({ code: 'custom', message: '모집 마감일은 오늘 이후여야 합니다.', path: ['recruitDeadline'] });
    }
    if (data.startDate && data.startDate < today) {
      ctx.addIssue({ code: 'custom', message: '모임 시작일은 오늘 이후여야 합니다.', path: ['startDate'] });
    }
    if (data.endDate && data.endDate < today) {
      ctx.addIssue({ code: 'custom', message: '모임 종료일은 오늘 이후여야 합니다.', path: ['endDate'] });
    }
    if (data.recruitDeadline && data.startDate && data.recruitDeadline >= data.startDate) {
      ctx.addIssue({
        code: 'custom',
        message: '모집 마감일은 모임 시작일보다 빨라야 합니다.',
        path: ['recruitDeadline'],
      });
    }
    if (data.startDate && data.endDate && data.endDate <= data.startDate) {
      ctx.addIssue({ code: 'custom', message: '종료일은 시작일 이후여야 합니다.', path: ['endDate'] });
    }
  });

/** POST `/gatherings` — 모임 생성 폼 */
export const gatheringFormSchema = gatheringFormBaseSchema.and(dateRefinementSchema);

/** PUT `/gatherings/:gatheringId` — 모임 수정 폼 (모든 필드 optional) */
export const gatheringUpdateFormSchema = gatheringFormBaseSchema.partial();
