/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { ExpirationPlugin, NetworkOnly, Serwist, StaleWhileRevalidate } from 'serwist';

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
  // L2 결정 "정적만" — runtimeCaching(API 캐싱)은 의도적으로 비워둠(3겹 캐시 버그 방지).
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true, // 새 SW가 대기 없이 즉시 활성화 (반영 빠름)
  clientsClaim: true, // 활성화 즉시 열려 있는 탭을 SW가 관리
  navigationPreload: true,
  // navigation(페이지) 요청을 SW가 "처리"하게 만든다. NetworkOnly라 페이지는
  // 캐시하지 않지만(정적만 유지), 요청이 SW를 거치므로 오프라인 시 fallback이 발동한다.
  // (runtimeCaching을 아예 비우면 navigation이 passthrough돼 fallback이 안 터짐)
  runtimeCaching: [
    {
      matcher({ request }) {
        return request.mode === 'navigate';
      },
      handler: new NetworkOnly(),
    },
    // 이미지(로고·아바타·썸네일 등)는 정적 자산이므로 런타임 캐싱.
    // precache(빌드 타임)는 /images/* 백엔드 rewrite의 308 때문에 실패 → 런타임으로 캐싱.
    // StaleWhileRevalidate: 캐시 즉시 표시 + 뒤에서 갱신. 오프라인 시 캐시본 사용.
    {
      matcher({ request }) {
        return request.destination === 'image';
      },
      handler: new StaleWhileRevalidate({
        cacheName: 'images',
        plugins: [new ExpirationPlugin({ maxEntries: 80, maxAgeSeconds: 30 * 24 * 60 * 60 })],
      }),
    },
  ],
  // L2 오프라인 폴백: 네트워크가 끊겨 "문서(페이지)"를 못 불러오면
  // 프리캐시된 /~offline 페이지를 대신 보여준다. (route handler가 /~offline을 precache)
  fallbacks: {
    entries: [
      {
        url: '/~offline',
        matcher({ request }) {
          return request.destination === 'document';
        },
      },
    ],
  },
});

// install / activate / fetch 등 Serwist 기본 이벤트 연결
serwist.addEventListeners();

// ── L3(FCM 푸시) ────────────────────────────────────────────────────
// 앱이 열려있을 때 백엔드가 보낸 푸시 알림을 수신해 시스템 알림으로 표시한다.
// 앱이 닫혀있을 때는 public/firebase-messaging-sw.js의 onBackgroundMessage가 담당한다.

self.addEventListener('push', (event: PushEvent) => {
  // payload가 없거나 유효한 JSON이 아니면 .json()이 동기 예외를 던진다.
  let data: { title?: string; body?: string; url?: string };
  try {
    data = event.data?.json() ?? {};
  } catch {
    // payload 파싱 실패 시에도 알림 자체는 표시한다.
    data = { title: '새 알림', body: '새로운 알림이 도착했습니다.' };
  }

  event.waitUntil(
    self.registration.showNotification(data.title ?? '새 알림', {
      body: data.body,
      icon: '/icons/pwa/icon-192.png',
      data: { url: data.url },
    }),
  );
});

// 사용자가 알림 팝업을 클릭하면 해당 URL로 이동한다.
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow(event.notification.data?.url ?? '/'));
});
