import { http, HttpResponse, delay } from 'msw';

import { createApiResponse } from '../utils';

import type { PushTokenActionResponse } from '@/api/push/types';

const BASE = '/api/v1/push/tokens';

// 동일 토큰 중복 등록 무시(upsert) 동작을 흉내내기 위한 인메모리 저장소
const registeredTokens = new Set<string>();

export const pushHandlers = [
  /** POST /api/v1/push/tokens */
  http.post(BASE, async ({ request }) => {
    await delay(100);
    const { token } = (await request.json()) as { token: string };
    registeredTokens.add(token);
    return HttpResponse.json(createApiResponse<PushTokenActionResponse>({ success: true }));
  }),

  /** DELETE /api/v1/push/tokens */
  http.delete(BASE, async ({ request }) => {
    await delay(100);
    const { token } = (await request.json()) as { token: string };
    registeredTokens.delete(token);
    return HttpResponse.json(createApiResponse<PushTokenActionResponse>({ success: true }));
  }),
];
