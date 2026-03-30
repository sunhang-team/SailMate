import type { GatheringListItem } from '@/api/gatherings/types';

/** POST/DELETE `/gatherings/:gatheringId/likes` 응답 */
export interface LikeToggleResponse {
  success: boolean;
}

/** GET `/users/me/likes` — 쿼리 파라미터 */
export interface GetMyLikesParams {
  page?: number;
  limit?: number;
}

/** GET `/users/me/likes` — 응답 */
export interface GetMyLikesResponse {
  gatherings: GatheringListItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}
