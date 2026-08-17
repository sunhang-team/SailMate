import { queryOptions, useMutation, useQueryClient, isServer } from '@tanstack/react-query';
import axios from 'axios';

import { invalidateServerCache } from '@/lib/invalidateServerCache';

import { applicationKeys } from '../applications/keys';

import {
  getCategories,
  fetchCategories,
  getApplicationStatus,
  fetchMainGatherings,
  fetchGatheringDetail,
  getGatheringDetail,
  getGatherings,
  createGathering,
  updateGathering,
  deleteGathering,
  createGatheringDraft,
  updateGatheringDraft,
  getGatheringDrafts,
  getGatheringDraftDetail,
  deleteGatheringDraft,
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
  SaveGatheringDraftRequest,
  SaveGatheringDraftResponse,
  DeleteGatheringDraftResponse,
} from './types';

export const gatheringKeys = {
  all: ['gatherings'] as const,
  categories: () => [...gatheringKeys.all, 'categories'] as const,
  main: (params?: GetMainGatheringsParams) => [...gatheringKeys.all, 'main', params ?? {}] as const,
  list: (params?: GetGatheringsParams) => [...gatheringKeys.all, 'list', params ?? {}] as const,
  detail: (gatheringId: number) => [...gatheringKeys.all, 'detail', gatheringId] as const,
  applicationStatus: (gatheringId: number) => [...gatheringKeys.all, 'applicationStatus', gatheringId] as const,
  drafts: () => [...gatheringKeys.all, 'drafts'] as const,
  draft: (draftId: number) => [...gatheringKeys.all, 'draft', draftId] as const,
};

export const gatheringQueries = {
  /** GET /gatherings/categories — 카테고리 목록 */
  categories: () =>
    queryOptions({
      queryKey: gatheringKeys.categories(),
      queryFn: () => (isServer ? fetchCategories() : getCategories()),
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
      // 404는 리소스가 실제로 없다는 확정적 응답이므로 재시도하지 않음 (삭제 직후 잔여 구독자로 인한 재요청 낭비 방지)
      retry: (failureCount, error) => {
        if (axios.isAxiosError(error) && error.response?.status === 404) return false;
        return failureCount < 3;
      },
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

  /** GET /gatherings/drafts — 내 임시저장 목록 */
  drafts: () =>
    queryOptions({
      queryKey: gatheringKeys.drafts(),
      queryFn: () => getGatheringDrafts(),
    }),

  /** GET /gatherings/drafts/:draftId — 임시저장 상세 */
  draft: (draftId: number) =>
    queryOptions({
      queryKey: gatheringKeys.draft(draftId),
      queryFn: () => getGatheringDraftDetail(draftId),
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

      // 삭제된 모임의 detail/applicationStatus는 재요청 대상이 아니므로 캐시에서 완전히 제거
      queryClient.removeQueries({ queryKey: gatheringKeys.detail(gatheringId), exact: true });
      queryClient.removeQueries({ queryKey: gatheringKeys.applicationStatus(gatheringId), exact: true });

      await Promise.all([
        // 목록류(main/list/categories/drafts)는 최신 상태 반영 위해 invalidate 유지,
        // detail/applicationStatus는 위에서 이미 제거했으므로 제외
        queryClient.invalidateQueries({
          queryKey: gatheringKeys.all,
          predicate: (query) => {
            const [, resource] = query.queryKey;
            return resource !== 'detail' && resource !== 'applicationStatus';
          },
        }),
        queryClient.invalidateQueries({ queryKey: ['memberships'] }),
        // 삭제된 모임에 걸린 신청 내역도 더는 유효하지 않으므로 함께 무효화
        queryClient.invalidateQueries({ queryKey: applicationKeys.all }),
      ]);
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

/** POST /gatherings/drafts — 임시저장 생성 */
export const useCreateGatheringDraft = (
  options?: UseMutationOptions<SaveGatheringDraftResponse, Error, SaveGatheringDraftRequest, unknown>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: SaveGatheringDraftRequest) => createGatheringDraft(body),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: gatheringKeys.drafts() });
      queryClient.invalidateQueries({ queryKey: gatheringKeys.draft(data.draftId) });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

/** PUT /gatherings/drafts/:draftId — 임시저장 수정 */
export const useUpdateGatheringDraft = (
  draftId: number | null,
  options?: UseMutationOptions<SaveGatheringDraftResponse, Error, SaveGatheringDraftRequest, unknown>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: SaveGatheringDraftRequest) => {
      if (!draftId) throw new Error('draftId is required for draft update');
      return updateGatheringDraft(draftId, body);
    },
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: gatheringKeys.drafts() });
      if (draftId) queryClient.invalidateQueries({ queryKey: gatheringKeys.draft(draftId) });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

/** DELETE /gatherings/drafts/:draftId — 임시저장 삭제 */
export const useDeleteGatheringDraft = (
  draftId: number,
  options?: UseMutationOptions<DeleteGatheringDraftResponse, Error, void, unknown>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteGatheringDraft(draftId),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: gatheringKeys.drafts() });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
