import { z } from 'zod';

export const MATES = ['연기 메이트', '불씨 메이트', '불꽃 메이트', '태양 메이트'] as const;

export const GOOD_TAGS = [
  '약속을 잘 지켜요',
  '적극적이에요',
  '팀 분위기를 밝게 만들어요',
  '할 일을 미루지 않아요',
  '책임감 있게 해내요',
  '소통이 활발해요',
] as const;

export const BAD_TAGS = [
  '약속을 잘 지키지 않아요',
  '소통이 어려워요',
  '할 일을 미뤄요',
  '소극적이에요',
  '목표 달성에 소홀해요',
  '참여도가 아쉬워요',
] as const;

/** 선택 가능한 리뷰 태그 목록 (태그 추가/수정 시 여기만 변경하면 됨) */
export const REVIEW_TAGS = [...MATES, ...GOOD_TAGS, ...BAD_TAGS] as const;

/** 태그 단일 값 검증 스키마 */
export const reviewTagSchema = z.enum(REVIEW_TAGS);

/** POST `/gatherings/:gatheringId/reviews` — 팀원 1명에 대한 리뷰 항목 */
export const reviewItemSchema = z.object({
  targetUserId: z.number(),
  tags: z.array(reviewTagSchema).min(1, '태그를 최소 1개 선택해주세요.'),
  comment: z.string().max(200, '코멘트는 최대 200자까지 입력 가능합니다.').optional(),
});

/** POST `/gatherings/:gatheringId/reviews` — 전체 폼 스키마 */
export const createReviewsSchema = z.object({
  reviews: z.array(reviewItemSchema),
});
