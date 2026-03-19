import type { z } from 'zod';

import type { loginFormSchema, signupFormSchema } from './schemas';

// 폼 타입 (스키마 추론)
export type LoginForm = z.infer<typeof loginFormSchema>;

export type SignupForm = z.infer<typeof signupFormSchema>;

// 응답 타입
export interface LoginUser {
  id: number;
  email: string;
  nickname: string;
  profileImage: string;
  reputationScore: number;
}

export interface LoginResponse {
  user: LoginUser;
}

export interface RegisterResponse {
  userId: number;
  email: string;
  nickname: string;
}

export interface OAuthCallbackResponse {
  isNewUser: boolean;
}

export interface CheckAvailabilityResponse {
  available: boolean;
}
