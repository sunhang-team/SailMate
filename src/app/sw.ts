/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { Serwist } from 'serwist';

import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';

// Serwist가 빌드 시 "프리캐시할 정적 자산 목록"을 이 변수에 주입한다.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

// SW는 브라우저 페이지가 아니라 ServiceWorker 환경에서 돈다.
declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  // 정적 자산(JS/CSS/폰트/이미지/앱 셸) 프리캐시.
  // L2 결정 "정적만" — runtimeCaching(API 캐싱)은 의도적으로 비워둠.
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true, // 새 SW가 대기 없이 즉시 활성화 (반영 빠름)
  clientsClaim: true, // 활성화 즉시 열려 있는 탭을 SW가 관리
  navigationPreload: true,
  // runtimeCaching: L2에서 정적 자산 한정 전략 추가 (API는 제외 — 3겹 캐시 버그 방지)
});

// install / activate / fetch 등 Serwist 기본 이벤트 연결
serwist.addEventListeners();

// ── L3(FCM 푸시) 자리 ──────────────────────────────────────────────
// 푸시 도입 시 아래에 FCM 메시지 핸들러를 연결한다. 지금은 골격만 비워둠.
//
// self.addEventListener('push', (event) => {
//   const data = event.data?.json();
//   event.waitUntil(self.registration.showNotification(data.title, { body: data.body }));
// });
//
// self.addEventListener('notificationclick', (event) => {
//   event.notification.close();
//   event.waitUntil(self.clients.openWindow(event.notification.data?.url ?? '/'));
// });
