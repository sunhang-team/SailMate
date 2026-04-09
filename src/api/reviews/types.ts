import type { z } from 'zod';

import type { reviewTagSchema, reviewItemSchema, createReviewsSchema } from './schemas';

/** 리뷰 태그 유니온 타입 */
export type ReviewTag = z.infer<typeof reviewTagSchema>;

/** POST `/gatherings/:gatheringId/reviews` — 팀원 1명에 대한 리뷰 항목 타입 */
export type ReviewItem = z.infer<typeof reviewItemSchema>;

/** POST `/gatherings/:gatheringId/reviews` — 전체 폼 타입 */
export type CreateReviewsForm = z.infer<typeof createReviewsSchema>;

/** POST `/gatherings/:gatheringId/reviews` 응답 */
export interface CreateReviewsResponse {
  success: boolean;
}

/** GET `/users/:userId/reviews` 쿼리 파라미터 */
export interface UserReviewsParams {
  page?: number;
}

/** GET `/users/:userId/reviews` 응답 내 리뷰어 정보 */
export interface ReviewerInfo {
  id: number;
  nickname: string;
  profileImage?: string;
}

/** GET `/users/:userId/reviews` 응답 내 리뷰 항목 */
export interface Review {
  id: number;
  reviewer: ReviewerInfo;
  gatheringTitle: string;
  tags: ReviewTag[];
  comment?: string;
  createdAt: string;
}

/** GET `/users/:userId/reviews` 응답 내 활동 에너지 항목 */
export interface MatesTagCount {
  tag: string; // 에너지 레벨 (연기, 불씨, 불꽃, 태양)
  count: number;
}

/** GET `/users/:userId/reviews` 응답 */
export interface UserReviewListResponse {
  reviews: Review[];
  totalCount: number;
  matesTagCounts: MatesTagCount[];
}
