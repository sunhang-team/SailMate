import { useEffect, useState } from 'react';

import { onRegistered, register } from 'firebase/messaging';

import { getFirebaseMessaging } from '@/lib/firebase';

export interface UseFCMTokenResult {
  /** 현재 등록된 FCM 토큰. 최초 발급 및 갱신 시마다 갱신됨 */
  token: string | null;
  /** 브라우저의 FCM 지원 여부. 판별 전에는 null */
  isSupported: boolean | null;
  /** 등록 과정에서 발생한 에러 */
  error: Error | null;
  /** 브라우저 알림 권한 요청. 반드시 사용자 제스처(클릭 등) 컨텍스트에서 호출해야 한다 */
  requestPermission: () => Promise<NotificationPermission>;
}

/**
 * FCM 토큰 구독 훅.
 *
 * enabled가 true인 동안 토큰 발급/갱신을 구독하고, false가 되면 구독을 해제한다.
 * 토큰을 서버에 등록/해지하는 책임은 이 훅에 두지 않고 호출자(오케스트레이션 훅)에게 위임한다.
 */
export const useFCMToken = (enabled: boolean): UseFCMTokenResult => {
  const [token, setToken] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const requestPermission = () => Notification.requestPermission();

  useEffect(() => {
    if (!enabled) return;

    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    const subscribe = async () => {
      const messaging = await getFirebaseMessaging();
      if (cancelled) return;

      setIsSupported(messaging !== null);
      if (!messaging) return;

      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
      if (!vapidKey) {
        throw new Error('NEXT_PUBLIC_FIREBASE_VAPID_KEY 환경변수가 설정되지 않았습니다.');
      }

      // onRegistered는 토큰이 최초 발급되거나 갱신될 때마다 호출된다.
      unsubscribe = onRegistered(messaging, (newToken) => {
        if (!cancelled) setToken(newToken);
      });

      try {
        await register(messaging, { vapidKey });
      } catch (registerError) {
        throw new Error('FCM 등록에 실패했습니다.', { cause: registerError });
      }
    };

    subscribe().catch((subscribeError: unknown) => {
      if (cancelled) return;
      setError(subscribeError instanceof Error ? subscribeError : new Error('FCM 등록에 실패했습니다.'));
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [enabled]);

  return { token: enabled ? token : null, isSupported, error, requestPermission };
};
