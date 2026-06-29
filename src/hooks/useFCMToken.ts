import { onRegistered, register } from 'firebase/messaging';

import { getFirebaseMessaging } from '@/lib/firebase';

/**
 * FCM 푸시 알림 권한 요청 + 토큰 발급 훅.
 *
 * 반환된 토큰은 L3_2에서 서버(POST /v1/notifications/tokens)에 저장해
 * 실제 푸시 알림 발송에 사용한다.
 *
 * 토큰이 null인 경우:
 *   - 미지원 브라우저 (iOS Safari 15 이하 등)
 *   - 사용자가 알림 권한 거부
 */
export const useFCMToken = () => {
  const requestAndGetToken = (): Promise<string | null> => {
    return new Promise(async (resolve) => {
      // 1. 미지원 브라우저 체크 — 지원하지 않으면 조용히 종료
      const messaging = await getFirebaseMessaging();
      if (!messaging) return resolve(null);

      // 2. 브라우저 알림 권한 요청
      // 결과: 'granted'(허용) | 'denied'(거부) | 'default'(닫음)
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return resolve(null);

      // 3. 토큰 발급 콜백 등록
      // onRegistered는 토큰이 최초 발급되거나 갱신될 때마다 콜백을 호출한다.
      // 현재는 첫 번째 토큰만 받고 즉시 unsubscribe()로 리스너를 해제한다.
      //
      // [L3_2 작업자에게]
      // 백엔드 연동 시에는 unsubscribe()를 제거하고 useEffect 클린업으로 옮겨야 한다.
      // 그래야 토큰이 갱신될 때마다 서버(POST /v1/notifications/tokens)에 새 토큰을 저장할 수 있다.
      // Promise 구조로는 값을 한 번만 반환할 수 있으므로, 갱신 감지를 위해서는
      // useState + useEffect 구조로 훅을 재설계해야 한다.
      const unsubscribe = onRegistered(messaging, (token) => {
        unsubscribe();
        resolve(token);
      });

      // 4. Firebase Installation ID(FID) 기반 FCM 등록 시작
      await register(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });
    });
  };

  return { requestAndGetToken };
};
