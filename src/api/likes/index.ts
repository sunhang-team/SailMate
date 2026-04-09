import { axiosClient } from '@/lib/axiosClient';
import { unwrapResponse } from '@/api/common/utils';

import type { ApiResponse } from '@/api/common/types';
import type { GetMyLikeIdsResponse, GetMyLikesParams, GetMyLikesResponse } from './types';

/** POST /v1/gatherings/:gatheringId/likes — 찜 추가 */
export const addLike = async (gatheringId: number): Promise<void> => {
  await axiosClient.post(`/v1/gatherings/${gatheringId}/likes`);
};

/** DELETE /v1/gatherings/:gatheringId/likes — 찜 취소 */
export const removeLike = async (gatheringId: number): Promise<void> => {
  await axiosClient.delete(`/v1/gatherings/${gatheringId}/likes`);
};

/** GET /v1/users/me/likes/ids — 내가 찜한 모임 ID 목록 */
export const getMyLikeIds = async (): Promise<GetMyLikeIdsResponse> => {
  const { data } = await axiosClient.get<ApiResponse<GetMyLikeIdsResponse>>('/v1/users/me/likes/ids');
  return unwrapResponse(data);
};

/** GET /v1/users/me/likes — 내 찜 목록 */
export const getMyLikes = async (params?: GetMyLikesParams): Promise<GetMyLikesResponse> => {
  const { data } = await axiosClient.get<ApiResponse<GetMyLikesResponse>>('/v1/users/me/likes', { params });
  return unwrapResponse(data);
};

const MY_LIKES_FETCH_LIMIT = 999;

/** 클라이언트 필터용 — `totalPages`만큼 이어 받아 전체 찜 목록 병합 */
export const getAllMyLikes = async (): Promise<GetMyLikesResponse> => {
  const first = await getMyLikes({ page: 1, limit: MY_LIKES_FETCH_LIMIT });
  if (first.totalPages <= 1) {
    return first;
  }

  const gatherings = [...first.gatherings];
  const remainingPages = Array.from({ length: first.totalPages - 1 }, (_, i) => i + 2);
  const remainingResults = await Promise.all(
    remainingPages.map((page) => getMyLikes({ page, limit: MY_LIKES_FETCH_LIMIT })),
  );
  remainingResults.forEach((result) => gatherings.push(...result.gatherings));

  return {
    gatherings,
    totalCount: first.totalCount,
    totalPages: 1,
    currentPage: 1,
  };
};
