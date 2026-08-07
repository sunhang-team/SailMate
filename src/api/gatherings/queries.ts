import { queryOptions, useMutation, useQueryClient, isServer } from '@tanstack/react-query';

import { invalidateServerCache } from '@/lib/invalidateServerCache';
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
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: gatheringKeys.all }),
        queryClient.invalidateQueries({ queryKey: ['memberships'] }),
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
