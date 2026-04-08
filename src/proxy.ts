import { NextRequest, NextResponse } from 'next/server';

import { setAuthCookies } from '@/lib/authCookies';
import { extractTokens } from '@/lib/tokenUtils';

const PROTECTED_ROUTES = ['/my', '/gatherings/new'];
const PROTECTED_PATTERNS = [/^\/gatherings\/\d+\/dashboard/];
const AUTH_ROUTES = ['/login', '/register'];

const tryRefreshToken = async (request: NextRequest): Promise<NextResponse | null> => {
  const refreshToken = request.cookies.get('refreshToken')?.value;
  if (!refreshToken) return null;

  const backendBaseUrl = process.env.BACKEND_BASE_URL?.replace(/\/+$/, '');
  if (!backendBaseUrl) return null;

  try {
    const backendResponse = await fetch(`${backendBaseUrl}/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
    });

    if (!backendResponse.ok) return null;

    const json = (await backendResponse.json()) as unknown;
    const { accessToken: nextAccessToken, refreshToken: nextRefreshToken } = extractTokens(json);
    if (!nextAccessToken) return null;

    const response = NextResponse.next();
    setAuthCookies(response, { accessToken: nextAccessToken, refreshToken: nextRefreshToken });

    return response;
  } catch {
    return null;
  }
};

export const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const hasAccessToken = request.cookies.has('accessToken');
  const hasRefreshToken = request.cookies.has('refreshToken');
  const isProtectedRoute =
    PROTECTED_ROUTES.some((route) => pathname.startsWith(route)) ||
    PROTECTED_PATTERNS.some((pattern) => pattern.test(pathname));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // accessToken 없고 refreshToken만 있으면 → 갱신 시도
  if (!hasAccessToken && hasRefreshToken) {
    const refreshed = await tryRefreshToken(request);

    if (refreshed) {
      // 인증 라우트면 홈으로 (이미 로그인된 상태)
      if (isAuthRoute) {
        const redirect = NextResponse.redirect(new URL('/', request.url));
        refreshed.cookies.getAll().forEach((cookie) => {
          redirect.cookies.set(cookie);
        });
        return redirect;
      }
      // 그 외 페이지는 갱신된 쿠키를 실어서 계속 진행
      return refreshed;
    }

    // 갱신 실패: 보호 라우트면 로그인으로
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // 공개 라우트면 그냥 진행 (비로그인 상태로)
    return NextResponse.next();
  }

  // 보호 라우트: 토큰 하나도 없으면 로그인으로
  if (isProtectedRoute && !hasAccessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 인증 라우트: accessToken 있으면 /main으로
  if (isAuthRoute && hasAccessToken) {
    return NextResponse.redirect(new URL('/main', request.url));
  }

  // 랜딩 페이지: 로그인 상태면 /main으로
  if (pathname === '/' && hasAccessToken) {
    return NextResponse.redirect(new URL('/main', request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
