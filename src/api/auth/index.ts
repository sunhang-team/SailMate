import { axiosClient } from '@/lib/axiosClient';
import { unwrapResponse } from '@/api/common/utils';

import type { ApiResponse } from '@/api/common/types';
import type {
  LoginForm,
  LoginResponse,
  SignupForm,
  RegisterResponse,
  CheckAvailabilityResponse,
  OAuthCallbackResponse,
} from './types';

/** POST /v1/auth/register — 이메일 회원가입 */
export const register = async ({ passwordConfirmation, ...body }: SignupForm): Promise<RegisterResponse> => {
  const { data } = await axiosClient.post<ApiResponse<RegisterResponse>>('/v1/auth/register', body);
  return unwrapResponse(data);
};

/** POST /v1/auth/login — 이메일 로그인 */
export const login = async (body: LoginForm): Promise<LoginResponse> => {
  const { data } = await axiosClient.post<ApiResponse<LoginResponse>>('/v1/auth/login', body);
  return unwrapResponse(data);
};

/** POST /v1/auth/logout — 로그아웃 */
export const logout = async (): Promise<void> => {
  await axiosClient.post('/v1/auth/logout', {});
};

/** GET /v1/auth/check/email — 이메일 중복 확인 */
export const checkEmail = async (email: string): Promise<CheckAvailabilityResponse> => {
  const { data } = await axiosClient.get<ApiResponse<CheckAvailabilityResponse>>('/v1/auth/check/email', {
    params: { email },
  });
  return unwrapResponse(data);
};

/** GET /v1/auth/check/nickname — 닉네임 중복 확인 */
export const checkNickname = async (nickname: string): Promise<CheckAvailabilityResponse> => {
  const { data } = await axiosClient.get<ApiResponse<CheckAvailabilityResponse>>('/v1/auth/check/nickname', {
    params: { nickname },
  });
  return unwrapResponse(data);
};

/** GET /v1/auth/{provider}/callback — 소셜 로그인 콜백 */
export const socialLoginCallback = async (provider: string, code: string): Promise<OAuthCallbackResponse> => {
  const { data } = await axiosClient.get<ApiResponse<OAuthCallbackResponse>>(`/v1/auth/${provider}/callback`, {
    params: { code },
  });
  return unwrapResponse(data);
};
