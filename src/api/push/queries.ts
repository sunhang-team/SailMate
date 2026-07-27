import { useMutation } from '@tanstack/react-query';
import { registerFcmToken, unregisterFcmToken } from './index';
import type { UseMutationOptions } from '@tanstack/react-query';
import type { PushTokenActionResponse } from './types';

/** POST /api/v1/push/tokens — FCM 푸시 토큰 등록 */
export const useRegisterFcmToken = (options?: UseMutationOptions<PushTokenActionResponse, Error, string>) => {
  return useMutation({
    ...options,
    mutationFn: (token: string) => registerFcmToken(token),
  });
};

/** DELETE /api/v1/push/tokens — FCM 푸시 토큰 삭제 */
export const useUnregisterFcmToken = (options?: UseMutationOptions<PushTokenActionResponse, Error, string>) => {
  return useMutation({
    ...options,
    mutationFn: (token: string) => unregisterFcmToken(token),
  });
};
