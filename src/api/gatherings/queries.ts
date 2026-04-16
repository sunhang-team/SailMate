import { queryOptions, useMutation, useQueryClient, isServer } from '@tanstack/react-query';

import { invalidateServerCache } from '@/lib/invalidateServerCache';
import {
  getCategories,
  getApplicationStatus,
  fetchMainGatherings,
  fetchGatheringDetail,
  getGatheringDetail,
  getGatherings,
  createGathering,
  updateGathering,
  deleteGathering,
  GATHERING_TAGS,
  getMainGatherings,
} from './index';

import type { UseMutationOptions } from '@tanstack/react-query';
import type {
  GetMainGatheringsParams,
  GetGatheringsParams,
  CreateGatheringRequest,
  CreateGatheringResponse,
  UpdateGatheringRequest,
  UpdateGatheringResponse,
} from './types';

export const gatheringKeys = {
  all: ['gatherings'] as const,
  categories: () => [...gatheringKeys.all, 'categories'] as const,
  main: (params?: GetMainGatheringsParams) => [...gatheringKeys.all, 'main', params ?? {}] as const,
  list: (params?: GetGatheringsParams) => [...gatheringKeys.all, 'list', params ?? {}] as const,
  detail: (gatheringId: number) => [...gatheringKeys.all, 'detail', gatheringId] as const,
  applicationStatus: (gatheringId: number) => [...gatheringKeys.all, 'applicationStatus', gatheringId] as const,
};

export const gatheringQueries = {
  /** GET /gatherings/categories — 카테고리 목록 */
  categories: () =>
    queryOptions({
      queryKey: gatheringKeys.categories(),
      queryFn: () => getCategories(),
      staleTime: Infinity,
    }),

  /** GET /gatherings/main — 메인 페이지 모임 목록 */
  main: (params?: GetMainGatheringsParams) =>
    queryOptions({
      queryKey: gatheringKeys.main(params),
      queryFn: () => (isServer ? fetchMainGatherings(params) : getMainGatherings(params)),
    }),

  /** GET /gatherings/:gatheringId — 모임 상세 */
  detail: (gatheringId: number) =>
    queryOptions({
      queryKey: gatheringKeys.detail(gatheringId),
      queryFn: () => (isServer ? fetchGatheringDetail(gatheringId) : getGatheringDetail(gatheringId)),
    }),

  /** GET /gatherings/:gatheringId/application-status — 모임 신청 상태 */
  applicationStatus: (gatheringId: number) =>
    queryOptions({
      queryKey: gatheringKeys.applicationStatus(gatheringId),
      queryFn: () => getApplicationStatus(gatheringId),
    }),

  /** GET /gatherings — 모임 목록 검색 */
  list: (params?: GetGatheringsParams) =>
    queryOptions({
      queryKey: gatheringKeys.list(params),
      queryFn: () => getGatherings(params),
    }),
};

/** POST /gatherings — 모임 생성 */
export const useCreateGathering = (
  options?: UseMutationOptions<CreateGatheringResponse, Error, CreateGatheringRequest, unknown>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateGatheringRequest) => createGathering(body),
    ...options,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await invalidateServerCache(GATHERING_TAGS.all);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: gatheringKeys.all }),
        queryClient.invalidateQueries({ queryKey: ['memberships'] }),
      ]);
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

/** PUT /gatherings/:gatheringId — 모임 수정 */
export const useUpdateGathering = (
  gatheringId: number,
  options?: UseMutationOptions<UpdateGatheringResponse, Error, UpdateGatheringRequest, unknown>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateGatheringRequest) => {
      if (!gatheringId) throw new Error('gatheringId is required for update');
      return updateGathering(gatheringId, body);
    },
    ...options,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await invalidateServerCache(GATHERING_TAGS.all);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: gatheringKeys.all }),
        queryClient.invalidateQueries({ queryKey: ['memberships'] }),
      ]);
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

/** DELETE /gatherings/:gatheringId — 모임 삭제 */
export const useDeleteGathering = (gatheringId: number, options?: UseMutationOptions<void, Error, void, unknown>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteGathering(gatheringId),
    ...options,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await invalidateServerCache(GATHERING_TAGS.all);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: gatheringKeys.all }),
        queryClient.invalidateQueries({ queryKey: ['memberships'] }),
      ]);
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
