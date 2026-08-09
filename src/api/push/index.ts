import { axiosClient } from '@/lib/axiosClient';
import { unwrapResponse } from '@/api/common/utils';
import type { ApiResponse } from '@/api/common/types';
import type { PushTokenActionResponse } from './types';

/**
 * POST /api/v1/push/tokens
 * FCM 푸시 토큰 등록 (알림 허용 또는 토큰 갱신 시). 이미 존재하는 토큰이면 서버가 무시한다.
 */
export const registerFcmToken = async (token: string): Promise<PushTokenActionResponse> => {
  const { data } = await axiosClient.post<ApiResponse<PushTokenActionResponse>>('/v1/push/tokens', { token });
  return unwrapResponse(data);
};

/**
 * DELETE /api/v1/push/tokens
 * FCM 푸시 토큰 삭제 (알림 끄기·로그아웃 시)
 */
export const unregisterFcmToken = async (token: string): Promise<PushTokenActionResponse> => {
  const { data } = await axiosClient.delete<ApiResponse<PushTokenActionResponse>>('/v1/push/tokens', {
    data: { token },
  });
  return unwrapResponse(data);
};
