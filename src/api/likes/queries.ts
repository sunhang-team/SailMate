import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { getAllMyLikes, getMyLikeIds, getMyLikes, addLike, removeLike } from './index';

import type { UseMutationOptions } from '@tanstack/react-query';
import type { GetMyLikesParams } from './types';

export const likeKeys = {
  all: ['likes'] as const,
  myIds: () => [...likeKeys.all, 'myIds'] as const,
  my: (params?: GetMyLikesParams) => [...likeKeys.all, 'my', params ?? {}] as const,
  myAll: () => [...likeKeys.all, 'myAll'] as const,
};

export const likeQueries = {
  /** GET /users/me/likes/ids — 내가 찜한 모임 ID 목록 */
  myIds: () =>
    queryOptions({
      queryKey: likeKeys.myIds(),
      queryFn: () => getMyLikeIds(),
    }),

  /** GET /users/me/likes — 내 찜 목록 */
  my: (params?: GetMyLikesParams) =>
    queryOptions({
      queryKey: likeKeys.my(params),
      queryFn: () => getMyLikes(params),
    }),

  /** 클라이언트 필터/정렬용 — 페이지를 이어 받아 전체 찜 목록 */
  myAll: () =>
    queryOptions({
      queryKey: likeKeys.myAll(),
      queryFn: () => getAllMyLikes(),
    }),
};

/** POST /gatherings/:gatheringId/likes — 찜 추가 */
export const useAddLike = (options?: UseMutationOptions<void, Error, number, { previousIds?: number[] }>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gatheringId: number) => addLike(gatheringId),
    ...options,
    onMutate: async (gatheringId) => {
      await queryClient.cancelQueries({ queryKey: likeKeys.all });

      const previousIds = queryClient.getQueryData<number[]>(likeKeys.myIds());

      if (previousIds) {
        queryClient.setQueryData<number[]>(likeKeys.myIds(), Array.from(new Set([...previousIds, gatheringId])));
      }

      return { previousIds };
    },
    onError: (err, variables, onMutateResult, context) => {
      if (onMutateResult?.previousIds) {
        queryClient.setQueryData(likeKeys.myIds(), onMutateResult.previousIds);
      }
      options?.onError?.(err, variables, onMutateResult, context);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: likeKeys.all });
    },
    onSuccess: (data, variables, onMutateResult, context) => {
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

/** DELETE /gatherings/:gatheringId/likes — 찜 취소 */
export const useRemoveLike = (options?: UseMutationOptions<void, Error, number, { previousIds?: number[] }>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gatheringId: number) => removeLike(gatheringId),
    ...options,
    onMutate: async (gatheringId) => {
      await queryClient.cancelQueries({ queryKey: likeKeys.all });

      const previousIds = queryClient.getQueryData<number[]>(likeKeys.myIds());

      if (previousIds) {
        queryClient.setQueryData<number[]>(
          likeKeys.myIds(),
          previousIds.filter((id) => id !== gatheringId),
        );
      }

      return { previousIds };
    },
    onError: (err, variables, onMutateResult, context) => {
      if (onMutateResult?.previousIds) {
        queryClient.setQueryData(likeKeys.myIds(), onMutateResult.previousIds);
      }
      options?.onError?.(err, variables, onMutateResult, context);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: likeKeys.all });
    },
    onSuccess: (data, variables, onMutateResult, context) => {
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
