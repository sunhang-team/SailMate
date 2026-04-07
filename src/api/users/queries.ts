import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { getUsersMe, getUsersUserId, updateProfile, updatePassword, deleteUser } from '.';

import type { UseMutationOptions } from '@tanstack/react-query';
import type {
  UpdateProfileResponseData,
  UpdateProfileForm,
  UpdatePasswordForm,
  UpdatePasswordResponseData,
} from './types';
import { invalidateServerCache } from '@/lib/invalidateServerCache';

export const userKeys = {
  all: ['users'] as const,
  me: () => [...userKeys.all, 'me'] as const,
  userId: (userId: number) => [...userKeys.all, userId] as const,
};

export const userQueries = {
  /** GET /v1/users/me - 내 프로필 조회*/
  me: () =>
    queryOptions({
      queryKey: userKeys.me(),
      queryFn: () => getUsersMe(),
      retry: false,
    }),
  /** GET /v1/users/:userId - 다른 사람 프로필 조회*/
  userId: (userId: number) =>
    queryOptions({
      queryKey: userKeys.userId(userId),
      queryFn: () => getUsersUserId(userId),
    }),
};

/** PATCH /v1/users/me - 내 프로필 수정*/
export const useUpdateProfile = (
  options?: UseMutationOptions<UpdateProfileResponseData, Error, UpdateProfileForm, unknown>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateProfileForm) => updateProfile(body),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      invalidateServerCache(userKeys.all[0]);
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

/** PATCH /v1/users/me/password - 비밀번호 변경*/
export const useUpdatePassword = (
  options?: UseMutationOptions<UpdatePasswordResponseData, Error, UpdatePasswordForm, unknown>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdatePasswordForm) => updatePassword(body),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

/** DELETE /v1/users/me - 회원 탈퇴*/
export const useDeleteUser = (options?: UseMutationOptions<void, Error, void, unknown>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteUser(),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.removeQueries({ queryKey: userKeys.me() });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
