import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { getAllMyLikes, getMyLikeIds, getMyLikes, addLike, removeLike } from './index';

import type { QueryKey } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import type { GetMyLikeIdsResponse, GetMyLikesParams, GetMyLikesResponse } from './types';

export const likeKeys = {
  all: ['likes'] as const,
  myIds: () => [...likeKeys.all, 'myIds'] as const,
  my: (params?: GetMyLikesParams) => [...likeKeys.all, 'my', params ?? {}] as const,
  myFull: () => [...likeKeys.all, 'my', 'full'] as const,
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

  /** 마이페이지 찜 탭 — 클라이언트 필터용 전체 목록 */
  myFull: () =>
    queryOptions({
      queryKey: likeKeys.myFull(),
      queryFn: () => getAllMyLikes(),
    }),
};

interface RemoveLikeMutationContext {
  previousMy: [QueryKey, GetMyLikesResponse | undefined][];
  previousIds: GetMyLikeIdsResponse | undefined;
}

const isMyLikesListQueryKey = (key: QueryKey) => key[0] === 'likes' && key[1] === 'my';

/** POST /gatherings/:gatheringId/likes — 찜 추가 */
export const useAddLike = (options?: UseMutationOptions<void, Error, number, unknown>) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (gatheringId: number) => addLike(gatheringId),
    onSettled: (...args) => {
      void queryClient.invalidateQueries({ queryKey: likeKeys.all });
      return options?.onSettled?.(...args);
    },
  });
};

/** DELETE /gatherings/:gatheringId/likes — 찜 취소 (낙관적 업데이트) */
export const useRemoveLike = (options?: UseMutationOptions<void, Error, number, RemoveLikeMutationContext>) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (gatheringId: number) => removeLike(gatheringId),
    onMutate: async (gatheringId) => {
      await queryClient.cancelQueries({ queryKey: likeKeys.all });

      const previousMy = queryClient.getQueriesData<GetMyLikesResponse>({
        predicate: (q) => isMyLikesListQueryKey(q.queryKey),
      });

      const previousIds = queryClient.getQueryData<GetMyLikeIdsResponse>(likeKeys.myIds());

      queryClient.setQueriesData<GetMyLikesResponse>({ predicate: (q) => isMyLikesListQueryKey(q.queryKey) }, (old) => {
        if (!old) return old;
        const nextGatherings = old.gatherings.filter((g) => g.id !== gatheringId);
        return {
          ...old,
          gatherings: nextGatherings,
          totalCount: Math.max(0, old.totalCount - 1),
        };
      });

      queryClient.setQueryData<GetMyLikeIdsResponse>(likeKeys.myIds(), (old) =>
        old ? old.filter((id) => id !== gatheringId) : old,
      );

      return { previousMy, previousIds };
    },
    onError: (...args) => {
      const context = args[2] as RemoveLikeMutationContext | undefined;
      if (context?.previousMy) {
        for (const [key, data] of context.previousMy) {
          queryClient.setQueryData(key, data);
        }
      }
      if (context?.previousIds !== undefined) {
        queryClient.setQueryData(likeKeys.myIds(), context.previousIds);
      }
      options?.onError?.(...args);
    },
    onSettled: (...args) => {
      void queryClient.invalidateQueries({ queryKey: likeKeys.all });
      return options?.onSettled?.(...args);
    },
  });
};
