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
