import { axiosClient } from '@/lib/axiosClient';
import { unwrapResponse } from '@/api/common/utils';

import type { ApiResponse } from '@/api/common/types';
import type {
  MembershipGathering,
  MyGatheringsParams,
  MyGatheringList,
  GatheringMembersList,
  DeleteMember,
} from './types';

// ── 백엔드 호환 레이어 (백엔드가 categories: string[] 로 전환하면 ��거) ──────

const CATEGORY_KEY_TO_LABEL: Record<string, string> = {
  DEVELOPMENT: '개발',
  LANGUAGE: '���학',
  BOOK: '독서',
  CERTIFICATE: '자격증',
  DESIGN: '디자인',
};

const normalizeMembershipGathering = (item: MembershipGathering): MembershipGathering => {
  if (item.categories) return item;

  const raw = item as MembershipGathering & { category?: string };
  const label = raw.category ? (CATEGORY_KEY_TO_LABEL[raw.category] ?? raw.category) : '';
  return { ...item, categories: label ? [label] : [] };
};

/** GET /v1/users/me/gatherings — 내 모임 목록 */
export const getMyGatherings = async (params?: MyGatheringsParams): Promise<MyGatheringList> => {
  const { data } = await axiosClient.get<ApiResponse<MyGatheringList>>('/v1/users/me/gatherings', {
    params,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
    },
  });
  const result = unwrapResponse(data);
  return { ...result, gatherings: result.gatherings.map(normalizeMembershipGathering) };
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
