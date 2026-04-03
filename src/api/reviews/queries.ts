import { queryOptions, useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { CreateReviewsForm, CreateReviewsResponse, UserReviewsParams } from './types';
import { createReviews, getUserReviewList } from '.';
import { invalidateServerCache } from '@/lib/invalidateServerCache';

export const reviewKeys = {
  all: ['reviews'] as const,
  list: (userId: number, params?: UserReviewsParams) => [...reviewKeys.all, 'list', userId, params] as const,
  detail: (reviewId: number) => [...reviewKeys.all, 'detail', reviewId] as const,
};

export const reviewQueries = {
  /** GET v1/users/:userId/reviews — 리뷰 목록 조회 */
  list: (userId: number, params?: UserReviewsParams) =>
    queryOptions({
      queryKey: reviewKeys.list(userId, params),
      queryFn: () => getUserReviewList(userId, params),
    }),
};

/** POST v1/gatherings/:gatheringId/reviews — 리뷰 작성 */
export const useReviewMutations = (
  options?: UseMutationOptions<CreateReviewsResponse, Error, { gatheringId: number; body: CreateReviewsForm }>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { gatheringId: number; body: CreateReviewsForm }) =>
      createReviews(params.gatheringId, params.body),
    ...options,
    onSuccess: (data, variable, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      invalidateServerCache(reviewKeys.all[0]);
      options?.onSuccess?.(data, variable, onMutateResult, context);
    },
  });
};
