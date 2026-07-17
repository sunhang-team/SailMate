import { useEffect, useState } from 'react';

import { useIsMounted } from '@frontend-toolkit-js/hooks';

import { useRegisterFcmToken, useUnregisterFcmToken } from '@/api/notifications/queries';
import { useFCMToken } from '@/hooks/useFCMToken';
import { PUSH_NOTIFICATION_ENABLED_KEY, PUSH_NOTIFICATION_TOKEN_KEY } from '@/lib/pushNotification';

export interface UsePushNotificationSettingOptions {
  /** 사용자가 브라우저 알림 권한 요청을 거부했을 때 */
  onDenied?: () => void;
}

export interface UsePushNotificationSettingResult {
  isSupported: boolean | null;
  permission: NotificationPermission | null;
  isEnabled: boolean;
  isPending: boolean;
  error: Error | null;
  enable: () => Promise<void>;
  disable: () => void;
}

/**
 * 알림 권한 요청 + FCM 토큰 등록/해지를 조합한 알림 설정 토글 훅.
 *
 * 브라우저의 Notification.permission은 한 번 'granted'가 되면 계속 유지되므로
 * 사용자가 토글로 껐는지 여부는 별도로 localStorage에 저장해 판단한다.
 * mount 전(SSR)에는 브라우저 API에 접근할 수 없으므로 useIsMounted로 게이팅하고,
 * enable/disable 호출 이후의 값은 override state로 우선한다(useAuth의 hasSession 패턴과 동일).
 */
export const usePushNotificationSetting = (
  options?: UsePushNotificationSettingOptions,
): UsePushNotificationSettingResult => {
  const isMounted = useIsMounted();
  const [permissionOverride, setPermissionOverride] = useState<NotificationPermission | null>(null);
  const [isEnabledOverride, setIsEnabledOverride] = useState<boolean | null>(null);
  const [mutationError, setMutationError] = useState<Error | null>(null);

  const permission =
    permissionOverride ?? (isMounted && typeof Notification !== 'undefined' ? Notification.permission : null);
  const isEnabledLocally =
    isEnabledOverride ?? (isMounted && localStorage.getItem(PUSH_NOTIFICATION_ENABLED_KEY) === 'true');

  const { token, isSupported, error, requestPermission } = useFCMToken(isEnabledLocally && permission === 'granted');

  const { mutate: registerToken, isPending: isRegisterPending } = useRegisterFcmToken({
    onError: (registerError) => setMutationError(registerError),
  });
  const { mutate: unregisterToken, isPending: isUnregisterPending } = useUnregisterFcmToken({
    onError: (unregisterError) => setMutationError(unregisterError),
  });

  useEffect(() => {
    if (!token) return;
    registerToken(token);
    localStorage.setItem(PUSH_NOTIFICATION_TOKEN_KEY, token);
  }, [token, registerToken]);

  const enable = async () => {
    const result = permission === 'granted' ? permission : await requestPermission();
    setPermissionOverride(result);

    if (result !== 'granted') {
      options?.onDenied?.();
      return;
    }

    setIsEnabledOverride(true);
    localStorage.setItem(PUSH_NOTIFICATION_ENABLED_KEY, 'true');
  };

  const disable = () => {
    const lastToken = localStorage.getItem(PUSH_NOTIFICATION_TOKEN_KEY);
    if (lastToken) unregisterToken(lastToken);

    setIsEnabledOverride(false);
    localStorage.setItem(PUSH_NOTIFICATION_ENABLED_KEY, 'false');
    localStorage.removeItem(PUSH_NOTIFICATION_TOKEN_KEY);
  };

  return {
    isSupported,
    permission,
    isEnabled: isEnabledLocally && permission === 'granted',
    isPending: isRegisterPending || isUnregisterPending,
    error: error ?? mutationError,
    enable,
    disable,
  };
};
