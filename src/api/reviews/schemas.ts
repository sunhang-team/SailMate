import { z } from 'zod';

/** 선택 가능한 리뷰 태그 목록 */
export const REVIEW_TAGS = [
  '성실해요',
  '소통이 좋아요',
  '잘 도와줘요',
  '시간을 잘 지켜요',
  '다시 함께하고 싶어요',
] as const;

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
