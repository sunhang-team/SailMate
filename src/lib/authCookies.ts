import { NextResponse } from 'next/server';

import { getExpirationDate } from './getExpirationDate';

const ACCESS_TOKEN_COOKIE = 'accessToken';
const REFRESH_TOKEN_COOKIE = 'refreshToken';
const AUTH_HINT_COOKIE = 'has-session';
const isSecureCookie = process.env.NODE_ENV === 'production';

export const setAuthCookies = (
  response: NextResponse,
  tokens: { accessToken: string | null; refreshToken: string | null },
) => {
  if (tokens.accessToken) {
    const expires = getExpirationDate(tokens.accessToken) ?? undefined;
    response.cookies.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
      httpOnly: true,
      secure: isSecureCookie,
      sameSite: 'lax',
      path: '/',
      expires,
    });
    response.cookies.set(AUTH_HINT_COOKIE, '1', {
      httpOnly: false,
      secure: isSecureCookie,
      sameSite: 'lax',
      path: '/',
      expires,
    });
  }

  if (tokens.refreshToken) {
    const expires = getExpirationDate(tokens.refreshToken) ?? undefined;
    response.cookies.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
      httpOnly: true,
      secure: isSecureCookie,
      sameSite: 'lax',
      path: '/',
      expires,
    });
  }
};

export const clearAuthCookies = (response: NextResponse) => {
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
  response.cookies.set(AUTH_HINT_COOKIE, '', {
    httpOnly: false,
    secure: isSecureCookie,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
};

export const deleteAuthCookies = (response: NextResponse) => {
  response.cookies.delete(ACCESS_TOKEN_COOKIE);
  response.cookies.delete(REFRESH_TOKEN_COOKIE);
  response.cookies.delete(AUTH_HINT_COOKIE);
};
