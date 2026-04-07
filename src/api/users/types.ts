import type { z } from 'zod';

import type { ApiResponse } from '@/api/common/types';

import type { updatePasswordFormSchema, updatePasswordRequestSchema, updateProfileFormSchema } from './schemas';
import { Review } from '../reviews/types';

/**
 * PATCH /api/v1/users/me — 폼 (nickname?: string, profileImage?: File)
 */
export type UpdateProfileForm = z.infer<typeof updateProfileFormSchema>;

/**
 * PATCH /api/v1/users/me/password 요청 body
 */
export type UpdatePasswordRequest = z.infer<typeof updatePasswordRequestSchema>;

/**
 * PATCH /api/v1/users/me/password — 비밀번호 확인 필드 포함 폼
 */
export type UpdatePasswordForm = z.infer<typeof updatePasswordFormSchema>;

// 응답 타입

/** 인증 제공자 (GET 응답 `provider`) */
export type AuthProvider = 'EMAIL' | 'GOOGLE' | 'KAKAO';

/**
 * GET /api/v1/users/me 응답 `data`
 */
export interface User {
  id: number;
  email: string;
  nickname: string;
  profileImage: string;
  provider: AuthProvider;
  reputationScore: number;
  reputationLabel: string;
  completedGatherings: number;
  avgAchievementRate: number;
  reviewCount: number;
}

/**
 * GET /api/v1/users/{userId} 응답 `data`
 */
export type UserPublicProfile = Pick<
  User,
  'id' | 'nickname' | 'profileImage' | 'reputationScore' | 'reputationLabel'
> & {
  reviews?: Review[];
};

/**
 * GET /api/v1/users/me
 */
export type GetMeResponse = ApiResponse<User>;

/**
 * GET /api/v1/users/{userId}
 */
export type GetUserByIdResponse = ApiResponse<UserPublicProfile>;

/**
 * PATCH /api/v1/users/me 응답 `data`
 */
export interface UpdateProfileResponseData {
  id: number;
  nickname: string;
  profileImage: string;
}

/**
 * PATCH /api/v1/users/me 응답
 */
export type PatchMeResponse = ApiResponse<UpdateProfileResponseData>;

/**
 * PATCH /api/v1/users/me/password 200 응답 `data`
 */
export type UpdatePasswordResponseData = Record<string, never>;

/**
 * PATCH /api/v1/users/me/password 성공 응답
 *
 * 실패 시 예시:
 * - 이메일 가입(`provider: EMAIL`) 전용. 소셜 로그인 사용자는 비밀번호 변경 불가 (`ApiError`, `errorCode`는 `PatchPasswordErrorCode` 참고)
 */
export type PatchPasswordResponse = ApiResponse<UpdatePasswordResponseData>;

// PATCH 실패 (HTTP / errorCode — mutation에서 분기 시 사용, 백엔드 `errorCode`와 동기화)

/** PATCH /users/me — 닉네임 중복 등 **409** 응답 시 `errorCode`로 올 수 있는 값 */
export type PatchMeErrorCode = 'NICKNAME_DUPLICATE';

/** PATCH /users/me/password — 소셜 계정 등 **403** 응답 시 `errorCode`로 올 수 있는 값 */
export type PatchPasswordErrorCode = 'PASSWORD_CHANGE_FORBIDDEN';

/** 닉네임 중복 충돌 시 HTTP 상태 */
export const PATCH_ME_NICKNAME_CONFLICT_STATUS = 409 as const;

/** 비밀번호 변경 불가(소셜 로그인 등) 시 HTTP 상태 */
export const PATCH_PASSWORD_FORBIDDEN_STATUS = 403 as const;
