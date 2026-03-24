import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { invalidateServerCache } from '@/lib/invalidateServerCache';
import {
  fetchMainGatherings,
  fetchGatheringDetail,
  getGatherings,
  createGathering,
  updateGathering,
  deleteGathering,
  GATHERING_TAGS,
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
  main: (params?: GetMainGatheringsParams) => [...gatheringKeys.all, 'main', params ?? {}] as const,
  list: (params?: GetGatheringsParams) => [...gatheringKeys.all, 'list', params ?? {}] as const,
  detail: (gatheringId: number) => [...gatheringKeys.all, 'detail', gatheringId] as const,
};

export const gatheringQueries = {
  /** GET /gatherings/main — 메인 페이지 모임 목록 */
  main: (params?: GetMainGatheringsParams) =>
    queryOptions({
      queryKey: gatheringKeys.main(params),
      queryFn: () => fetchMainGatherings(params),
    }),

  /** GET /gatherings/:gatheringId — 모임 상세 */
  detail: (gatheringId: number) =>
    queryOptions({
      queryKey: gatheringKeys.detail(gatheringId),
      queryFn: () => fetchGatheringDetail(gatheringId),
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
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: gatheringKeys.all });
      invalidateServerCache(GATHERING_TAGS.all);
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
    mutationFn: (body: UpdateGatheringRequest) => updateGathering(gatheringId, body),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: gatheringKeys.detail(gatheringId) });
      queryClient.invalidateQueries({ queryKey: gatheringKeys.all });
      invalidateServerCache(GATHERING_TAGS.detail(gatheringId));
      invalidateServerCache(GATHERING_TAGS.all);
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
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: gatheringKeys.all });
      invalidateServerCache(GATHERING_TAGS.all);
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
