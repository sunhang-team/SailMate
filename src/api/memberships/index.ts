import { axiosClient } from '@/lib/axiosClient';
import { unwrapResponse } from '@/api/common/utils';

import type { ApiResponse } from '@/api/common/types';
import type { MyGatheringsParams, MyGatheringList, GatheringMembersList, DeleteMember } from './types';

/** GET /v1/users/me/gatherings — 내 모임 목록 */
export const getMyGatherings = async (params?: MyGatheringsParams): Promise<MyGatheringList> => {
  const { data } = await axiosClient.get<ApiResponse<MyGatheringList>>('/v1/users/me/gatherings', {
    params,
  });
  return unwrapResponse(data);
};

/** GET /v1/gatherings/:gatheringId/members — 모임 멤버 목록 */
export const getGatheringMembers = async (gatheringId: number): Promise<GatheringMembersList> => {
  const { data } = await axiosClient.get<ApiResponse<GatheringMembersList>>(`/v1/gatherings/${gatheringId}/members`);
  return unwrapResponse(data);
};

/** DELETE /v1/gatherings/:gatheringId/members/:userId — 멤버 강퇴 (모임장 전용) */
export const removeMember = async (gatheringId: number, userId: number): Promise<DeleteMember> => {
  const { data } = await axiosClient.delete<ApiResponse<DeleteMember>>(
    `/v1/gatherings/${gatheringId}/members/${userId}`,
  );
  return unwrapResponse(data);
};

/** DELETE /v1/gatherings/:gatheringId/members/me — 모임 탈퇴 (본인) */
export const leaveGathering = async (gatheringId: number): Promise<DeleteMember> => {
  const { data } = await axiosClient.delete<ApiResponse<DeleteMember>>(`/v1/gatherings/${gatheringId}/members/me`);
  return unwrapResponse(data);
};
