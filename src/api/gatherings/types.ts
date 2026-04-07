import type { z } from 'zod';

import type { gatheringFormSchema, gatheringUpdateFormSchema } from './schemas';

/** 모임 유형 (응답/표시용) */
export type GatheringType = '스터디' | '프로젝트';

/** 모임 유형 (API 쿼리 파라미터용) */
export type GatheringTypeParam = 'STUDY' | 'PROJECT';

/** 카테고리 항목 (GET /gatherings/categories 응답) */
export interface Category {
  id: number;
  name: string;
}

/** 모임 상태 */
export type GatheringStatus = 'RECRUITING' | 'IN_PROGRESS' | 'COMPLETED';

/** 참여 신청 상태 */
export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

/** 모임 내 역할 */
export type GatheringRole = 'LEADER' | 'MEMBER';

/** 모임장 정보 */
export interface LeaderInfo {
  id: number;
  nickname: string;
  profileImage: string | null;
}

/** 모임 멤버 정보 */
export interface MemberInfo {
  userId: number;
  nickname: string;
  profileImage: string | null;
  role: GatheringRole;
}

/** 모임 이미지 */
export interface GatheringImage {
  url: string;
  displayOrder: number;
}

/** 주차별 계획 (상세 응답용) */
export interface WeeklyPlan {
  week: number;
  title: string;
  startDate: string;
  endDate: string;
}

/** GET `/gatherings` — 모임 목록 아이템 */
export interface GatheringListItem {
  id: number;
  type: GatheringType;
  categories: string[];
  title: string;
  shortDescription: string;
  tags: string[];
  maxMembers: number;
  currentMembers: number;
  recruitDeadline: string;
  startDate: string;
  endDate: string;
  status: GatheringStatus;
  leader: LeaderInfo;
}

/** GET `/gatherings/:gatheringId` — 모임 상세 정보 */
export interface GatheringDetail extends GatheringListItem {
  description: string;
  goal: string;
  totalWeeks: number;
  images: GatheringImage[];
  weeklyPlans: WeeklyPlan[];
  members: MemberInfo[];
  myApplicationStatus: ApplicationStatus | null;
}

/** GET `/gatherings/{gatheringId}/application-status` — 모임 신청 상태 응답 */
export interface GetApplicationStatusResponse {
  myApplicationStatus: ApplicationStatus | null;
}

/** POST `/gatherings` — 모임 생성 폼 */
export type GatheringForm = z.infer<typeof gatheringFormSchema>;

/** PUT `/gatherings/:gatheringId` — 모임 수정 폼 */
export type GatheringUpdateForm = z.infer<typeof gatheringUpdateFormSchema>;

/** GET `/gatherings` — 쿼리 파라미터 */
export interface GetGatheringsParams {
  type?: GatheringTypeParam;
  categoryIds?: number[];
  sort?: 'latest' | 'popular' | 'deadline';
  status?: GatheringStatus | 'ALL';
  query?: string;
  page?: number;
  limit?: number;
}

/** GET `/gatherings` — 모임 목록 응답 */
export interface GetGatheringsResponse {
  gatherings: GatheringListItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

/** POST `/gatherings` — 모임 생성 요청 body */
export type CreateGatheringRequest = GatheringForm;

/** POST `/gatherings` — 모임 생성 응답 */
export interface CreateGatheringResponse {
  gathering: GatheringDetail;
}

/** GET `/gatherings/categories` — 카테고리 목록 응답 */
export interface GetCategoriesResponse {
  categories: Category[];
}

/** GET `/gatherings/main` — 쿼리 파라미터 */
export interface GetMainGatheringsParams {
  limit?: number;
}

/** GET `/gatherings/main` — 메인 페이지 모임 응답 */
export interface GetMainGatheringsResponse {
  popular: GatheringListItem[];
  deadline: GatheringListItem[];
  latest: GatheringListItem[];
}

/** GET `/gatherings/:gatheringId` — 모임 상세 응답 */
export type GetGatheringDetailResponse = GatheringDetail;

/** PUT `/gatherings/:gatheringId` — 모임 수정 요청 body */
export type UpdateGatheringRequest = GatheringUpdateForm;

/** PUT `/gatherings/:gatheringId` — 모임 수정 응답 */
export interface UpdateGatheringResponse {
  gathering: GatheringDetail;
}

/** DELETE `/gatherings/:gatheringId` — 모임 삭제 응답 */
export interface DeleteGatheringResponse {
  success: boolean;
}

/** POST `/gatherings` — 모임 생성 폼 (호환용 별칭) */
export type GatheringFormPartial = GatheringForm;
