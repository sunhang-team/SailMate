import { axiosClient } from '@/lib/axiosClient';
import { unwrapResponse } from '../common/utils';
import { CreateReviewsForm, CreateReviewsResponse, Review, UserReviewListResponse, UserReviewsParams } from './types';
import { ApiResponse } from '../common/types';

// 백엔드가 flat 필드(reviewerId, reviewerNickname)로 응답하므로 중첩 reviewer 객체로 변환
const normalizeReview = (
  raw: Review & {
    reviewerId?: number;
    reviewerNickname?: string;
    reviewerProfileImage?: string;
  },
): Review => {
  if (raw.reviewer) return raw;
  return {
    ...raw,
    reviewer: {
      id: raw.reviewerId!,
      nickname: raw.reviewerNickname!,
      profileImage: raw.reviewerProfileImage,
    },
  };
};

/** POST /v1/gatherings/:gatheringId/reviews — 리뷰 작성 */
export const createReviews = async (gatheringId: number, body: CreateReviewsForm): Promise<CreateReviewsResponse> => {
  const { data } = await axiosClient.post<ApiResponse<CreateReviewsResponse>>(
    `/v1/gatherings/${gatheringId}/reviews`,
    body,
  );
  return unwrapResponse(data);
};

/** GET /v1/users/:userId/reviews — 리뷰 목록 조회 */
export const getUserReviewList = async (
  userId: number,
  params?: UserReviewsParams,
): Promise<UserReviewListResponse> => {
  const { data } = await axiosClient.get<ApiResponse<UserReviewListResponse>>(`/v1/users/${userId}/reviews`, {
    params,
  });
  const result = unwrapResponse(data);
  return { ...result, reviews: result.reviews.map(normalizeReview) };
};
