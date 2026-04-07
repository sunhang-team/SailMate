import { axiosClient } from '@/lib/axiosClient';
import { unwrapResponse } from '@/api/common/utils';

import type {
  GetMeResponse,
  User,
  UpdateProfileForm,
  UpdateProfileResponseData,
  PatchMeResponse,
  UpdatePasswordForm,
  PatchPasswordResponse,
  UpdatePasswordResponseData,
  GetUserByIdResponse,
  UserPublicProfile,
} from './types';

/** GET /v1/users/me - 내 프로필 조회*/
export const getUsersMe = async (): Promise<User> => {
  const { data } = await axiosClient.get<GetMeResponse>(`/v1/users/me`);
  return unwrapResponse(data);
};

/** PATCH /v1/users/me - 내 프로필 수정 (multipart/form-data) */
export const updateProfile = async (body: UpdateProfileForm): Promise<UpdateProfileResponseData> => {
  const formData = new FormData();

  if (body.nickname !== undefined) {
    formData.append('nickname', body.nickname);
  }

  if (body.profileImage) {
    formData.append('profileImage', body.profileImage);
  }

  const { data } = await axiosClient.patch<PatchMeResponse>(`/v1/users/me`, formData);
  return unwrapResponse(data);
};

/** PATCH /v1/users/me/password - 비밀번호 변경*/
export const updatePassword = async ({
  newPasswordConfirmation,
  ...body
}: UpdatePasswordForm): Promise<UpdatePasswordResponseData> => {
  const { data } = await axiosClient.patch<PatchPasswordResponse>(`/v1/users/me/password`, body);
  return unwrapResponse(data);
};

/** DELETE /v1/users/me - 회원 탈퇴*/
export const deleteUser = async (): Promise<void> => {
  await axiosClient.delete(`/v1/users/me`);
};

/** GET /v1/users/:userId - 다른 사람 프로필 조회*/
export const getUsersUserId = async (userId: number): Promise<UserPublicProfile> => {
  const { data } = await axiosClient.get<GetUserByIdResponse>(`/v1/users/${userId}`);
  return unwrapResponse(data);
};
