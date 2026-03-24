import { http, HttpResponse, delay } from 'msw';

import { createApiResponse } from '../utils';

import type { RegisterResponse, LoginResponse, CheckAvailabilityResponse } from '@/api/auth/types';
import type { ApiError } from '@/api/common/types';

const BASE = '/api/v1/auth';

const TAKEN_EMAILS = ['taken@test.com'];
const TAKEN_NICKNAMES = ['마감왕'];

const createApiError = (message: string, errorCode: string): ApiError => ({
  success: false,
  data: null,
  message,
  errorCode,
});

export const authHandlers = [
  /** POST /api/v1/auth/register — 이메일 회원가입 */
  http.post(`${BASE}/register`, async ({ request }) => {
    await delay(300);

    const body = (await request.json()) as { email: string; password: string; nickname: string };

    if (TAKEN_EMAILS.includes(body.email) || TAKEN_NICKNAMES.includes(body.nickname)) {
      return HttpResponse.json(createApiError('이미 사용 중인 이메일 또는 닉네임입니다.', 'DUPLICATE'), {
        status: 409,
      });
    }

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
  http.get(`${BASE}/check/email`, async ({ request }) => {
    await delay(300);

    const email = new URL(request.url).searchParams.get('email') ?? '';

    return HttpResponse.json(
      createApiResponse<CheckAvailabilityResponse>({ available: !TAKEN_EMAILS.includes(email) }),
    );
  }),

  /** GET /api/v1/auth/check/nickname — 닉네임 중복 확인 */
  http.get(`${BASE}/check/nickname`, async ({ request }) => {
    await delay(300);

    const nickname = new URL(request.url).searchParams.get('nickname') ?? '';

    return HttpResponse.json(
      createApiResponse<CheckAvailabilityResponse>({ available: !TAKEN_NICKNAMES.includes(nickname) }),
    );
  }),
];
