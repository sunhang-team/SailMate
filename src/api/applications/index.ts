import axios from 'axios';

import { axiosClient } from '@/lib/axiosClient';

import { unwrapResponse } from '../common/utils';

import type { ApiResponse } from '../common/types';

import {
  ApplicationListResponse,
  ApplyGatheringForm,
  CreateApplicationResponse,
  MyApplicationListResponse,
  UpdateApplicationStatusRequest,
  UpdateApplicationStatusResponse,
} from './types';

/** POST v1/gatherings/:gatheringId/applications — 모임 참여 신청(신청자) */
export const createApplication = async (
  gatheringId: number,
  body: ApplyGatheringForm,
): Promise<CreateApplicationResponse> => {
  const { data } = await axiosClient.post<ApiResponse<CreateApplicationResponse>>(
    `/v1/gatherings/${gatheringId}/applications`,
    body,
  );
  return unwrapResponse(data);
};

/** GET v1/gatherings/:gatheringId/applications — 신청 목록 조회(모임장) */
export const getApplicationList = async (gatheringId: number): Promise<ApplicationListResponse> => {
  const { data } = await axiosClient.get<ApiResponse<ApplicationListResponse>>(
    `/v1/gatherings/${gatheringId}/applications`,
  );
  return unwrapResponse(data);
};

/** PATCH v1/gatherings/:gatheringId/applications/:applicationId — 신청 수락 / 거절(모임장) */
export const updateApplicationStatus = async (
  gatheringId: number,
  applicationId: number,
  body: UpdateApplicationStatusRequest,
): Promise<UpdateApplicationStatusResponse> => {
  const { data } = await axiosClient.patch<ApiResponse<UpdateApplicationStatusResponse>>(
    `/v1/gatherings/${gatheringId}/applications/${applicationId}`,
    body,
  );
  return unwrapResponse(data);
};

/** DELETE v1/gatherings/:gatheringId/applications/:applicationId — 신청 취소(신청자 본인) */
export const deleteApplication = async (gatheringId: number, applicationId: number): Promise<void> => {
  await axiosClient.delete(`/v1/gatherings/${gatheringId}/applications/${applicationId}`);
};

/** GET v1/users/me/applications — 내 신청 목록 조회(신청자) */
export const getMyApplicationList = async (): Promise<MyApplicationListResponse> => {
  try {
    const { data } = await axiosClient.get<ApiResponse<MyApplicationListResponse>>(`/v1/users/me/applications`);

    // 백엔드가 신청 없을 때 success: false로 반환하는 이슈 방어
    if (!data.success && data.data === null) {
      return { applications: [] };
    }

    return unwrapResponse(data);
  } catch (error) {
    // 백엔드가 신청 없을 때 404 GATHERING_NOT_FOUND를 반환하는 이슈 방어
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return { applications: [] };
    }
    throw error;
  }
};
