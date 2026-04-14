import { axiosClient } from '@/lib/axiosClient';
import { unwrapResponse } from '@/api/common/utils';
import type { ApiResponse } from '@/api/common/types';
import type { GetNotificationsParams, GetNotificationsResponse, PatchNotificationReadResponse } from './types';

/**
 * GET /api/v1/notifications
 * 알림 목록 조회 (페이지네이션)
 */
export const getNotifications = async (params?: GetNotificationsParams): Promise<GetNotificationsResponse> => {
  const { data } = await axiosClient.get<ApiResponse<GetNotificationsResponse>>('/v1/notifications', { params });
  return unwrapResponse(data);
};

/**
 * PATCH /api/v1/notifications/:notificationId/read
 * 특정 알림 읽음 처리
 */
export const readNotification = async (notificationId: number): Promise<PatchNotificationReadResponse> => {
  const { data } = await axiosClient.patch<ApiResponse<PatchNotificationReadResponse>>(
    `/v1/notifications/${notificationId}/read`,
  );
  return unwrapResponse(data);
};

/**
 * PATCH /api/v1/notifications/read-all
 * 전체 알림 읽음 처리
 */
export const readAllNotifications = async (): Promise<PatchNotificationReadResponse> => {
  const { data } = await axiosClient.patch<ApiResponse<PatchNotificationReadResponse>>('/v1/notifications/read-all');
  return unwrapResponse(data);
};
