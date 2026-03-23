import { queryOptions, useMutation } from '@tanstack/react-query';

import { checkEmail, checkNickname, login, logout, register } from './index';

import type { UseMutationOptions } from '@tanstack/react-query';
import type { LoginForm, LoginResponse, RegisterResponse, SignupForm } from './types';

export const authKeys = {
  checkEmail: (email: string) => ['auth', 'check', 'email', email] as const,
  checkNickname: (nickname: string) => ['auth', 'check', 'nickname', nickname] as const,
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
    ...options,
  });
};

/** POST /auth/login — 이메일 로그인 */
export const useLogin = (options?: UseMutationOptions<LoginResponse, Error, LoginForm, unknown>) => {
  return useMutation({
    mutationFn: login,
    ...options,
  });
};

/** POST /auth/logout — 로그아웃 */
export const useLogout = (options?: UseMutationOptions<void, Error, void, unknown>) => {
  return useMutation({
    mutationFn: logout,
    ...options,
  });
};
