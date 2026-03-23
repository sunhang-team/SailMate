import type { z } from 'zod';

import type { applyGatheringFormSchema } from './schemas';

/**
 * POST /gatherings/:gatheringId/applications 요청 body
 * 모임 참여 신청 폼
 */
export type ApplyGatheringForm = z.infer<typeof applyGatheringFormSchema>;

/** 신청 상태 */
export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

// TODO: Reviews 도메인 타입 생성 후 ApplicantReview → Review 타입으로 교체
/**
 * GET /gatherings/:gatheringId/applications 응답 내 신청자의 리뷰 정보
 */
export interface ApplicantReview {
  id: number;
  reviewer: { id: number; nickname: string };
  gatheringTitle: string;
  tags: string[];
  comment?: string;
  createdAt: string;
}

/**
 * GET /gatherings/:gatheringId/applications 응답 내 신청자 정보
 */
export interface Applicant {
  id: number;
  nickname: string;
  profileImage: string;
  reputationScore: number;
  reviews: ApplicantReview[];
}

/**
 * GET /gatherings/:gatheringId/applications 응답 내 개별 신청 항목
 * 모임장이 조회하는 신청 목록의 각 항목
 */
export interface ApplicationDetail {
  id: number;
  applicant: Applicant;
  personalGoal: string;
  selfIntroduction?: string;
  status: ApplicationStatus;
  createdAt: string;
}

/**
 * GET /gatherings/:gatheringId/applications 응답
 * 모임장용 신청 목록
 */
export interface ApplicationListResponse {
  applications: ApplicationDetail[];
}

/**
 * POST /gatherings/:gatheringId/applications 응답
 * 모임 참여 신청 생성 결과 (application 객체로 래핑)
 */
export interface CreateApplicationResponse {
  application: {
    id: number;
    status: ApplicationStatus;
    createdAt: string;
  };
}

/**
 * PATCH /gatherings/:gatheringId/applications/:applicationId 요청 body
 * 모임장의 신청 수락/거절
 */
export interface UpdateApplicationStatusRequest {
  status: Exclude<ApplicationStatus, 'PENDING'>;
}

/**
 * PATCH /gatherings/:gatheringId/applications/:applicationId 응답
 * 신청 수락/거절 결과 (application 객체로 래핑)
 */
export interface UpdateApplicationStatusResponse {
  application: {
    id: number;
    status: Exclude<ApplicationStatus, 'PENDING'>;
  };
}

/**
 * GET /users/me/applications 응답 내 모임 정보
 */
export interface MyApplicationGathering {
  id: number;
  title: string;
  type: string;
  status: string;
}

/**
 * GET /users/me/applications 응답 내 개별 신청 항목
 * 내가 신청한 모임의 각 항목
 */
export interface MyApplication {
  id: number;
  gathering: MyApplicationGathering;
  personalGoal: string;
  status: ApplicationStatus;
  createdAt: string;
}

/**
 * GET /users/me/applications 응답
 * 내 신청 목록
 */
export interface MyApplicationListResponse {
  applications: MyApplication[];
}
