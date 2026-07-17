import { http, HttpResponse, delay } from 'msw';

import { createApiResponse } from '../utils';

import type {
  GetNotificationsResponse,
  NotificationItem,
  PatchNotificationReadResponse,
  RegisterFcmTokenResponse,
  UnregisterFcmTokenResponse,
} from '@/api/notifications/types';

const BASE = '/api/v1/notifications';

// 시간차 자연스럽게 — 오늘(2026-05-28) 기준 방금/한 시간 전/어제/3일 전 분산
const minutesAgo = (n: number) => new Date(Date.now() - n * 60 * 1000).toISOString();

const mockNotifications: NotificationItem[] = [
  {
    id: 1,
    type: 'APPLICATION_RECEIVED',
    content: '박개발님이 React 19 & Next.js 스터디에 참여 신청했습니다.',
    isRead: false,
    targetUrl: '/gatherings/1',
    createdAt: minutesAgo(5),
  },
  {
    id: 2,
    type: 'APPLICATION_RECEIVED',
    content: '신입주니어님이 React 19 & Next.js 스터디에 참여 신청했습니다.',
    isRead: false,
    targetUrl: '/gatherings/1',
    createdAt: minutesAgo(45),
  },
  {
    id: 3,
    type: 'APPLICATION_ACCEPTED',
    content: 'SaaS 사이드 프로젝트 팀 모집 신청이 수락되었습니다.',
    isRead: false,
    targetUrl: '/gatherings/2',
    createdAt: minutesAgo(60 * 3),
  },
  {
    id: 4,
    type: 'REVIEW_REQUEST',
    content: '독서 기록 앱 만들기가 종료되었습니다. 동료들을 평가해주세요.',
    isRead: false,
    targetUrl: '/gatherings/7',
    createdAt: minutesAgo(60 * 8),
  },
  {
    id: 5,
    type: 'POKE',
    content: '박디자인님이 회의 참여를 요청했습니다.',
    isRead: true,
    targetUrl: '/gatherings/1/dashboard?tab=meeting',
    createdAt: minutesAgo(60 * 24),
  },
  {
    id: 6,
    type: 'GATHERING_STARTED',
    content: 'Spring Boot 심화 스터디가 시작되었습니다.',
    isRead: true,
    targetUrl: '/gatherings/3/dashboard',
    // gathering 3 실제 startDate(2026-05-05)와 정합 — 23일 전 시작
    createdAt: minutesAgo(60 * 24 * 23),
  },
  {
    id: 7,
    type: 'PENALTY_WARNING',
    content: '주차별 목표 미달성이 2회 누적되었습니다. 다음 주에는 꼭 완료해주세요.',
    isRead: true,
    targetUrl: '/my?tab=ongoing',
    createdAt: minutesAgo(60 * 24 * 3),
  },
  {
    id: 8,
    type: 'APPLICATION_REJECTED',
    // user 1이 멤버 아닌 모임(id 9, SQLD)으로 거절 알림 — applications.ts의 PENDING 시나리오와 별개 케이스
    content: 'JLPT N2 집중 대비반 신청이 거절되었습니다.',
    isRead: true,
    targetUrl: '/my?tab=pending',
    createdAt: minutesAgo(60 * 24 * 5),
  },
];

export const notificationsHandlers = [
  /** GET /api/v1/notifications */
  http.get(BASE, async ({ request }) => {
    await delay(150);

    const url = new URL(request.url);
    const page = Math.max(1, Number(url.searchParams.get('page') ?? 1));
    const limit = Math.max(1, Number(url.searchParams.get('limit') ?? 10));
    const start = (page - 1) * limit;
    const sliced = mockNotifications.slice(start, start + limit);
    const unreadCount = mockNotifications.filter((n) => !n.isRead).length;

    return HttpResponse.json(createApiResponse<GetNotificationsResponse>({ notifications: sliced, unreadCount }));
  }),

  /** PATCH /api/v1/notifications/:notificationId/read */
  http.patch(`${BASE}/:notificationId/read`, async ({ params }) => {
    await delay(100);
    const id = Number(params.notificationId);
    const target = mockNotifications.find((n) => n.id === id);
    if (target) target.isRead = true;
    return HttpResponse.json(createApiResponse<PatchNotificationReadResponse>({ success: true }));
  }),

  /** PATCH /api/v1/notifications/read-all */
  http.patch(`${BASE}/read-all`, async () => {
    await delay(100);
    mockNotifications.forEach((n) => {
      n.isRead = true;
    });
    return HttpResponse.json(createApiResponse<PatchNotificationReadResponse>({ success: true }));
  }),

  /** POST /api/v1/notifications/tokens */
  http.post(`${BASE}/tokens`, async () => {
    await delay(100);
    return HttpResponse.json(createApiResponse<RegisterFcmTokenResponse>({ success: true }));
  }),

  /** DELETE /api/v1/notifications/tokens */
  http.delete(`${BASE}/tokens`, async () => {
    await delay(100);
    return HttpResponse.json(createApiResponse<UnregisterFcmTokenResponse>({ success: true }));
  }),
];
