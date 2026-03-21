export type GatheringStatusFilter = 'recruiting' | 'in_progress' | 'completed' | 'all';

// GET /users/me/gatherings 쿼리 파라미터
export interface MyGatheringsParams {
  status?: GatheringStatusFilter;
  page?: number;
  limit?: number;
}

// 공통 유니온 타입
export type GatheringStatus = 'RECRUITING' | 'IN_PROGRESS' | 'COMPLETED';
export type MemberRole = 'LEADER' | 'MEMBER';

// 개별 모임 항목
export interface Gathering {
  id: number;
  type: string;
  category: string;
  title: string;
  shortDescription: string;
  tags: string[];
  maxMembers: number;
  currentMembers: number;
  startDate: string;
  endDate: string;
  status: GatheringStatus;
  myRole: MemberRole;
  isLiked: boolean;
}

// GET /users/me/gatherings 응답
export interface MyGatheringList {
  gatherings: Gathering[];
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
