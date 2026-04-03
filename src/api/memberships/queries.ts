import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { getMyGatherings, getGatheringMembers, removeMember, leaveGathering } from './index';

import type { UseMutationOptions } from '@tanstack/react-query';
import type { MyGatheringsParams, DeleteMember } from './types';

export const membershipKeys = {
  all: ['memberships'] as const,
  my: (params?: MyGatheringsParams) => [...membershipKeys.all, 'my', params ?? {}] as const,
  members: (gatheringId: number) => [...membershipKeys.all, 'members', gatheringId] as const,
};

export const membershipQueries = {
  /** GET /users/me/gatherings — 내 모임 목록 */
  my: (params?: MyGatheringsParams) =>
    queryOptions({
      queryKey: membershipKeys.my(params),
      queryFn: () => getMyGatherings(params),
    }),
  /** GET /gatherings/:gatheringId/members — 모임 멤버 목록 */
  members: (gatheringId: number) =>
    queryOptions({
      queryKey: membershipKeys.members(gatheringId),
      queryFn: () => getGatheringMembers(gatheringId),
    }),
};

/** DELETE /gatherings/:gatheringId/members/:userId — 멤버 강퇴 (모임장 전용) */
export const useRemoveMember = (
  gatheringId: number,
  options?: UseMutationOptions<DeleteMember, Error, number, unknown>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => removeMember(gatheringId, userId),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: membershipKeys.all });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

/** DELETE /gatherings/:gatheringId/members/me — 모임 탈퇴 (본인) */
export const useLeaveGathering = (
  gatheringId: number,
  options?: UseMutationOptions<DeleteMember, Error, void, unknown>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => leaveGathering(gatheringId),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: membershipKeys.all });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
