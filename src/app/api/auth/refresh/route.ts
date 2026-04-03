import { NextResponse, type NextRequest } from 'next/server';

import { getExpirationDate } from '@/lib/getExpirationDate';
import { isJsonResponse, extractTokens } from '@/lib/tokenUtils';

const ACCESS_TOKEN_COOKIE = 'accessToken';
const REFRESH_TOKEN_COOKIE = 'refreshToken';
const isSecureCookie = process.env.NODE_ENV === 'production';

const clearAuthCookies = (response: NextResponse) => {
  response.cookies.set(ACCESS_TOKEN_COOKIE, '', {
    httpOnly: true,
    secure: isSecureCookie,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  response.cookies.set(REFRESH_TOKEN_COOKIE, '', {
    httpOnly: true,
    secure: isSecureCookie,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
};

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value ?? null;
  if (!refreshToken) {
    const response = NextResponse.json(
      { success: false, data: null, message: 'Refresh token not found', errorCode: 'NO_REFRESH_TOKEN' },
      { status: 401 },
    );
    clearAuthCookies(response);
    return response;
  }
  // httpOnly 쿠키에서 Next.js 서버가 직접 토큰을 꺼냄. 토큰 없을 시 즉시 401 에러

  const baseUrl = process.env.BACKEND_BASE_URL;
  if (!baseUrl) throw new Error('BACKEND_BASE_URL is not defined');
  const backendBaseUrl = baseUrl.replace(/\/+$/, '');

  const backendResponse = await fetch(`${backendBaseUrl}/auth/refresh`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
    redirect: 'manual',
    cache: 'no-store',
  });

  const contentType = backendResponse.headers.get('content-type');
  if (!isJsonResponse(contentType)) {
    const body = await backendResponse.arrayBuffer();
    return new NextResponse(body, { status: backendResponse.status });
  }

  const json = (await backendResponse.json()) as unknown;
  const { accessToken: nextAccessToken, refreshToken: nextRefreshToken, stripped } = extractTokens(json);

  const response = NextResponse.json(stripped, { status: backendResponse.status });
  // extractTokens 유틸 함수를 통해 응답 JSON에서 token 추출 후 token 데이터 제거

  if (backendResponse.status === 401 || backendResponse.status === 403) {
    clearAuthCookies(response);
    return response;
  }

  if (nextAccessToken) {
    const expires = getExpirationDate(nextAccessToken) ?? undefined;
    response.cookies.set(ACCESS_TOKEN_COOKIE, nextAccessToken, {
      httpOnly: true,
      secure: isSecureCookie,
      sameSite: 'lax',
      path: '/',
      expires,
    });
  }

  if (nextRefreshToken) {
    const expires = getExpirationDate(nextRefreshToken) ?? undefined;
    response.cookies.set(REFRESH_TOKEN_COOKIE, nextRefreshToken, {
      httpOnly: true,
      secure: isSecureCookie,
      sameSite: 'lax',
      path: '/',
      expires,
    });
  }
  // 새로 발급받은 토큰은 프론트엔드에 주는 대신, Next.js 서버가 다시 httpOnly 쿠키로 브라우저에 심어줍니다.

  return response;
}
