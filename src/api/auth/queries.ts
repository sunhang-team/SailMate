import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { userKeys } from '@/api/users/queries';

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      options?.onSuccess?.(...args);
    },
  });
};

/** POST /auth/logout — 로그아웃 */
export const useLogout = (options?: UseMutationOptions<void, Error, void, unknown>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    ...options,
    onSuccess: (...args) => {
      queryClient.removeQueries({ queryKey: userKeys.me() });
      options?.onSuccess?.(...args);
    },
  });
};
