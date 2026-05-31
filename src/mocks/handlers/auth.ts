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

// ── 모의 JWT/쿠키 발급 ──
// 실제 BFF 프록시(/api/[...endpoint]/route.ts)가 백엔드 응답에서 토큰을 추출해
// HttpOnly 쿠키로 내려주는 동작을 모사한다. MSW 환경에서 회원 전용 기능을
// 테스트 가능하게 하려면 로그인/리프레시 응답에서 동일한 쿠키를 세팅해야 한다.

// MSW dev 한정 — 7일 TTL로 잡아 middleware의 토큰 갱신 경로(Edge runtime, MSW 미인터셉트)를
// 우회한다. HttpOnly는 떼서 Service Worker Set-Cookie 처리 경계의 변수를 제거.
const TOKEN_TTL_SEC = 60 * 60 * 24 * 7; // 7d

const base64UrlEncode = (input: string): string =>
  btoa(input).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

const createMockJwt = (sub: number, ttlSec: number): string => {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const payload = base64UrlEncode(JSON.stringify({ sub: String(sub), iat: now, exp: now + ttlSec }));
  return `${header}.${payload}.mock-signature`;
};

const buildAuthCookieHeaders = (userId: number): Headers => {
  const accessToken = createMockJwt(userId, TOKEN_TTL_SEC);
  const refreshToken = createMockJwt(userId, TOKEN_TTL_SEC);

  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.append('Set-Cookie', `accessToken=${accessToken}; Path=/; SameSite=Lax; Max-Age=${TOKEN_TTL_SEC}`);
  headers.append('Set-Cookie', `refreshToken=${refreshToken}; Path=/; SameSite=Lax; Max-Age=${TOKEN_TTL_SEC}`);
  headers.append('Set-Cookie', `has-session=1; Path=/; SameSite=Lax; Max-Age=${TOKEN_TTL_SEC}`);
  return headers;
};

const buildClearAuthCookieHeaders = (): Headers => {
  const headers = new Headers();
  headers.append('Set-Cookie', 'accessToken=; Path=/; Max-Age=0');
  headers.append('Set-Cookie', 'refreshToken=; Path=/; Max-Age=0');
  headers.append('Set-Cookie', 'has-session=; Path=/; Max-Age=0');
  return headers;
};

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

  /** POST /api/v1/auth/login — 이메일 로그인 (가짜 JWT 쿠키 발급) */
  http.post(`${BASE}/login`, async ({ request }) => {
    await delay(300);

    const body = (await request.json()) as { email: string; password: string };

    return new HttpResponse(
      JSON.stringify(
        createApiResponse<LoginResponse>({
          user: {
            id: 1,
            email: body.email,
            nickname: '테스터',
            profileImage: '',
            reputationScore: 0,
          },
        }),
      ),
      { status: 200, headers: buildAuthCookieHeaders(1) },
    );
  }),

  /** POST /api/v1/auth/logout — 로그아웃 (쿠키 제거) */
  http.post(`${BASE}/logout`, async () => {
    await delay(300);
    return new HttpResponse(null, { status: 200, headers: buildClearAuthCookieHeaders() });
  }),

  /** POST /api/auth/refresh — 토큰 재발급 (axiosClient 인터셉터가 401/500 시 자동 호출) */
  http.post('/api/auth/refresh', async () => {
    await delay(200);
    return new HttpResponse(null, { status: 200, headers: buildAuthCookieHeaders(1) });
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
