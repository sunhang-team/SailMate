export type GatheringStatusFilter = 'recruiting' | 'in_progress' | 'completed' | 'all';

import type { GatheringType } from '@/api/gatherings/types';

// GET /users/me/gatherings 쿼리 파라미터
export interface MyGatheringsParams {
  status?: GatheringStatusFilter;
  page?: number;
  limit?: number;
}

// 공통 유니온 타입
export type GatheringStatus = 'RECRUITING' | 'IN_PROGRESS' | 'COMPLETED';
export type MemberRole = 'LEADER' | 'MEMBER';

// 개별 모임 항목 (GET /users/me/gatherings 응답 내 모임)
export interface MembershipGathering {
  id: number;
  type: GatheringType;
  categories: string[];
  title: string;
  shortDescription: string;
  tags: string[];
  maxMembers: number;
  currentMembers: number;
  startDate: string;
  endDate: string;
  status: GatheringStatus;
  myRole: MemberRole;
  /** 리뷰 작성 여부 — 백엔드 연동 전까지 응답에 포함되지 않으므로 optional. undefined는 미작성(false)으로 처리 */
  hasReviewed?: boolean;
}

// GET /users/me/gatherings 응답
export interface MyGatheringList {
  gatherings: MembershipGathering[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

// 개별 멤버 항목
export interface Member {
  userId: number;
  nickname: string;
  profileImage: string;
  role: MemberRole;
  overallAchievementRate: number;
  isActive: boolean;
}

// GET /gatherings/:gatheringId/members 응답
export interface GatheringMembersList {
  members: Member[];
}

// DELETE /gatherings/:gatheringId/members/:userId 응답
// DELETE /gatherings/:gatheringId/members/me 응답
export interface DeleteMember {
  success: boolean;
}
