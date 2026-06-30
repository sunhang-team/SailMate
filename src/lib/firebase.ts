import { getApp, getApps, initializeApp } from 'firebase/app';
import { getMessaging, isSupported } from 'firebase/messaging';

const requiredEnv = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const missingKeys = Object.entries(requiredEnv)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length > 0) {
  throw new Error(`Firebase 환경변수가 설정되지 않았습니다: ${missingKeys.join(', ')}`);
}

const firebaseConfig = requiredEnv as Record<keyof typeof requiredEnv, string>;

// Next.js는 모듈을 여러 번 실행할 수 있으므로 앱이 이미 초기화됐으면 재사용
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const getFirebaseMessaging = async () => {
  const supported = await isSupported();
  if (!supported) return null;
  return getMessaging(app);
};
