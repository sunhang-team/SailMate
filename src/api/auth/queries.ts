import { queryOptions, useMutation } from '@tanstack/react-query';

import { checkEmail, checkNickname, login, logout, register } from './index';

import type { UseMutationOptions } from '@tanstack/react-query';
import type { LoginForm, LoginResponse, RegisterResponse, SignupForm } from './types';

export const authKeys = {
  all: ['auth'] as const,
  checks: () => [...authKeys.all, 'check'] as const,
  checkEmail: (email: string) => [...authKeys.checks(), 'email', email] as const,
  checkNickname: (nickname: string) => [...authKeys.checks(), 'nickname', nickname] as const,
};

export const authQueries = {
  /** GET /auth/check/email — 이메일 중복 확인 */
  checkEmail: (email: string) =>
    queryOptions({
      queryKey: authKeys.checkEmail(email),
      queryFn: () => checkEmail(email),
      enabled: !!email,
    }),
  /** GET /auth/check/nickname — 닉네임 중복 확인 */
  checkNickname: (nickname: string) =>
    queryOptions({
      queryKey: authKeys.checkNickname(nickname),
      queryFn: () => checkNickname(nickname),
      enabled: !!nickname,
    }),
};

/** POST /auth/register — 이메일 회원가입 */
export const useRegister = (options?: UseMutationOptions<RegisterResponse, Error, SignupForm, unknown>) => {
  return useMutation({
    mutationFn: register,
    // NOTE: 신규 가입이므로 무효화할 기존 캐시 없음
    ...options,
  });
};

/** POST /auth/login — 이메일 로그인 */
export const useLogin = (options?: UseMutationOptions<LoginResponse, Error, LoginForm, unknown>) => {
  return useMutation({
    mutationFn: login,
    // NOTE: 로그인 성공 시 GET /api/v1/users/me 캐시 무효화 필요
    // users 도메인 구현 후 userKeys.me() invalidateQueries 추가 예정
    ...options,
  });
};

/** POST /auth/logout — 로그아웃 */
export const useLogout = (options?: UseMutationOptions<void, Error, void, unknown>) => {
  return useMutation({
    mutationFn: logout,
    // NOTE: 로그아웃 성공 시 GET /api/v1/users/me 캐시 제거 필요
    // invalidate가 아닌 remove — 세션 종료이므로 데이터 자체를 삭제해야 함
    // users 도메인 구현 후 userKeys.me() removeQueries 추가 예정
    ...options,
  });
};
