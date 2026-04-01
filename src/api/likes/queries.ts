import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { getMyLikes, addLike, removeLike } from './index';

import type { UseMutationOptions } from '@tanstack/react-query';
import type { GetMyLikesParams } from './types';

export const likeKeys = {
  all: ['likes'] as const,
  my: (params?: GetMyLikesParams) => [...likeKeys.all, 'my', params ?? {}] as const,
};

export const likeQueries = {
  /** GET /users/me/likes — 내 찜 목록 */
  my: (params?: GetMyLikesParams) =>
    queryOptions({
      queryKey: likeKeys.my(params),
      queryFn: () => getMyLikes(params),
    }),
};

/** POST /gatherings/:gatheringId/likes — 찜 추가 */
export const useAddLike = (options?: UseMutationOptions<void, Error, number, unknown>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gatheringId: number) => addLike(gatheringId),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: likeKeys.all });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

/** DELETE /gatherings/:gatheringId/likes — 찜 취소 */
export const useRemoveLike = (options?: UseMutationOptions<void, Error, number, unknown>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gatheringId: number) => removeLike(gatheringId),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: likeKeys.all });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
