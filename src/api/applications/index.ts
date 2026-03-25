import { axiosClient } from '@/lib/axiosClient';

import { unwrapResponse } from '../common/utils';
import { ApiResponse } from '../common/types';

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
    `/gatherings/${gatheringId}/applications`,
    body,
  );
  return unwrapResponse(data);
};

/** GET v1/gatherings/:gatheringId/applications — 신청 목록 조회(모임장) */
export const getApplicationList = async (gatheringId: number): Promise<ApplicationListResponse> => {
  const { data } = await axiosClient.get<ApiResponse<ApplicationListResponse>>(
    `/gatherings/${gatheringId}/applications`,
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
    `/gatherings/${gatheringId}/applications/${applicationId}`,
    body,
  );
  return unwrapResponse(data);
};

/** DELETE v1/gatherings/:gatheringId/applications/:applicationId — 신청 취소(신청자 본인) */
export const deleteApplication = async (gatheringId: number, applicationId: number): Promise<void> => {
  await axiosClient.delete(`/gatherings/${gatheringId}/applications/${applicationId}`);
};

/** GET v1/users/me/applications — 내 신청 목록 조회(신청자) */
export const getMyApplicationList = async (): Promise<MyApplicationListResponse> => {
  const { data } = await axiosClient.get<ApiResponse<MyApplicationListResponse>>(`/users/me/applications`);
  return unwrapResponse(data);
};
