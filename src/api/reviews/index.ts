import { axiosClient } from '@/lib/axiosClient';
import { unwrapResponse } from '../common/utils';
import { CreateReviewsForm, CreateReviewsResponse, UserReviewListResponse, UserReviewsParams } from './types';
import { ApiResponse } from '../common/types';

/** POST v1/gatherings/:gatheringId/reviews — 리뷰 작성 */
export const createReviews = async (gatheringId: number, body: CreateReviewsForm): Promise<CreateReviewsResponse> => {
  const { data } = await axiosClient.post<ApiResponse<CreateReviewsResponse>>(
    `/gatherings/${gatheringId}/reviews`,
    body,
  );
  return unwrapResponse(data);
};

/** GET v1/users/:userId/reviews — 리뷰 목록 조회 */
export const getUserReviewList = async (
  userId: number,
  params?: UserReviewsParams,
): Promise<UserReviewListResponse> => {
  const { data } = await axiosClient.get<ApiResponse<UserReviewListResponse>>(`/users/${userId}/reviews`, { params });
  return unwrapResponse(data);
};
