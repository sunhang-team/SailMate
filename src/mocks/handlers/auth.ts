import { http, HttpResponse, delay } from 'msw';

import { createApiResponse } from '../utils';

import type { RegisterResponse, LoginResponse, CheckAvailabilityResponse } from '@/api/auth/types';

const BASE = '/api/v1/auth';

export const authHandlers = [
  /** POST /api/v1/auth/register — 이메일 회원가입 */
  http.post(`${BASE}/register`, async ({ request }) => {
    await delay(300);

    const body = (await request.json()) as { email: string; password: string; nickname: string };

    return HttpResponse.json(
      createApiResponse<RegisterResponse>({
        userId: Date.now(),
        email: body.email,
        nickname: body.nickname,
      }),
      { status: 201 },
    );
  }),

  /** POST /api/v1/auth/login — 이메일 로그인 */
  http.post(`${BASE}/login`, async ({ request }) => {
    await delay(300);

    const body = (await request.json()) as { email: string; password: string };

    return HttpResponse.json(
      createApiResponse<LoginResponse>({
        user: {
          id: 1,
          email: body.email,
          nickname: '테스터',
          profileImage: '',
          reputationScore: 0,
        },
      }),
    );
  }),

  /** POST /api/v1/auth/logout — 로그아웃 */
  http.post(`${BASE}/logout`, async () => {
    await delay(300);

    return new HttpResponse(null, { status: 200 });
  }),

  /** GET /api/v1/auth/check/email — 이메일 중복 확인 */
  http.get(`${BASE}/check/email`, async () => {
    await delay(300);

    return HttpResponse.json(createApiResponse<CheckAvailabilityResponse>({ available: true }));
  }),

  /** GET /api/v1/auth/check/nickname — 닉네임 중복 확인 */
  http.get(`${BASE}/check/nickname`, async () => {
    await delay(300);

    return HttpResponse.json(createApiResponse<CheckAvailabilityResponse>({ available: true }));
  }),
];
