import { NextResponse, type NextRequest } from 'next/server';
import { getExpirationDate } from '@/lib/getExpirationDate';
import { requestBackend } from '@/lib/serverFetch';
import { isJsonResponse, extractTokens } from '@/lib/tokenUtils';

const ACCESS_TOKEN_COOKIE = 'accessToken';
const REFRESH_TOKEN_COOKIE = 'refreshToken';
const isSecureCookie = process.env.NODE_ENV === 'production';

const isAuthEndpoint = (endpoint: string) => {
  const normalized = endpoint.replace(/^\/+/, '');
  return normalized.startsWith('auth/');
};

const buildEndpointFromParams = (params: { endpoint: string[] } | undefined) => {
  const parts = params?.endpoint ?? [];
  return parts.join('/');
};

async function proxy(request: NextRequest, params: { endpoint: string[] }) {
  const endpoint = buildEndpointFromParams(params);
  const backendResponse = await requestBackend({ request, endpoint });

  const contentType = backendResponse.headers.get('content-type');
  const shouldTransformAuth = isAuthEndpoint(endpoint) && isJsonResponse(contentType);

  if (!shouldTransformAuth) {
    const body = await backendResponse.arrayBuffer();
    const response = new NextResponse(body, { status: backendResponse.status });
    backendResponse.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (lower === 'set-cookie') return;
      response.headers.set(key, value);
    });
    return response;
  }

  const json = (await backendResponse.json()) as unknown;
  const { accessToken: nextAccessToken, refreshToken: nextRefreshToken, stripped } = extractTokens(json);

  const response = NextResponse.json(stripped, { status: backendResponse.status });

  backendResponse.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (lower === 'content-length') return;
    if (lower === 'set-cookie') return;
    response.headers.set(key, value);
  });

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

  return response;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ endpoint: string[] }> }) {
  return await proxy(request, await params);
}
export async function POST(request: NextRequest, { params }: { params: Promise<{ endpoint: string[] }> }) {
  return await proxy(request, await params);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ endpoint: string[] }> }) {
  return await proxy(request, await params);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ endpoint: string[] }> }) {
  return await proxy(request, await params);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ endpoint: string[] }> }) {
  return await proxy(request, await params);
}
