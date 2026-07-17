import { unregisterFcmToken } from '@/api/notifications';

export const PUSH_NOTIFICATION_ENABLED_KEY = 'sailmate:push-notification-enabled';
export const PUSH_NOTIFICATION_TOKEN_KEY = 'sailmate:push-notification-token';

/**
 * 로그아웃 시 현재 기기의 FCM 토큰을 서버에서 해지한다.
 * 공유 기기에서 계정 전환 시 이전 계정으로 알림이 오배송되는 것을 방지한다.
 * best-effort로 동작하며 실패해도 로그아웃 흐름을 막지 않는다.
 */
export const revokeFcmTokenOnLogout = async () => {
  const token = localStorage.getItem(PUSH_NOTIFICATION_TOKEN_KEY);
  if (!token) return;

  try {
    await unregisterFcmToken(token);
  } finally {
    localStorage.removeItem(PUSH_NOTIFICATION_TOKEN_KEY);
    localStorage.removeItem(PUSH_NOTIFICATION_ENABLED_KEY);
  }
};
