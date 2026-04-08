import { queryOptions, useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';

import {
  createApplication,
  deleteApplication,
  getApplicationList,
  getMyApplicationList,
  updateApplicationStatus,
} from '.';

import { invalidateServerCache } from '@/lib/invalidateServerCache';

import { GATHERING_TAGS } from '../gatherings';
import { gatheringKeys } from '../gatherings/queries';

import {
  ApplyGatheringForm,
  CreateApplicationResponse,
  UpdateApplicationStatusRequest,
  UpdateApplicationStatusResponse,
} from './types';

export const applicationKeys = {
  all: ['applications'] as const,
  list: (gatheringId: number) => [...applicationKeys.all, 'list', gatheringId] as const,
  myList: () => [...applicationKeys.all, 'myList'] as const,
};

export const applicationQueries = {
  /** GET /v1/gatherings/:gatheringId/applications - 신청 목록 조회(모임장)*/
  list: (gatheringId: number) =>
    queryOptions({
      queryKey: applicationKeys.list(gatheringId),
      queryFn: () => getApplicationList(gatheringId),
    }),

  /** GET v1/users/me/applications — 내 신청 목록 조회(신청자) */
  myList: () =>
    queryOptions({
      queryKey: applicationKeys.myList(),
      queryFn: () => getMyApplicationList(),
    }),
};

/** POST v1/gatherings/:gatheringId/applications — 모임 참여 신청(신청자) */
export const useCreateApplication = (
  gatheringId: number,
  options?: UseMutationOptions<CreateApplicationResponse, Error, ApplyGatheringForm, unknown>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: ApplyGatheringForm) => createApplication(gatheringId, body),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });

      invalidateServerCache(GATHERING_TAGS.all);
      invalidateServerCache(GATHERING_TAGS.detail(gatheringId));
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

/** PATCH v1/gatherings/:gatheringId/applications/:applicationId — 신청 수락 / 거절(모임장) */
export const useUpdateApplicationStatus = (
  gatheringId: number,
  applicationId: number,
  options?: UseMutationOptions<UpdateApplicationStatusResponse, Error, UpdateApplicationStatusRequest, unknown>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateApplicationStatusRequest) => updateApplicationStatus(gatheringId, applicationId, body),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
      queryClient.invalidateQueries({ queryKey: gatheringKeys.detail(gatheringId) });
      queryClient.invalidateQueries({ queryKey: gatheringKeys.applicationStatus(gatheringId) });

      invalidateServerCache(GATHERING_TAGS.all);
      invalidateServerCache(GATHERING_TAGS.detail(gatheringId));

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

/** DELETE v1/gatherings/:gatheringId/applications/:applicationId — 신청 취소(신청자 본인) */
export const useDeleteApplication = (
  gatheringId: number,
  applicationId: number,
  options?: UseMutationOptions<void, Error, void, unknown>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteApplication(gatheringId, applicationId),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
