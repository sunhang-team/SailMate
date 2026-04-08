import { NextResponse, type NextRequest } from 'next/server';

import { deleteAuthCookies, setAuthCookies } from '@/lib/authCookies';
import { requestBackend } from '@/lib/serverFetch';
import { isJsonResponse, extractTokens } from '@/lib/tokenUtils';

const isAuthEndpoint = (endpoint: string) => {
  const normalized = endpoint.replace(/^\/+/, '');
  return normalized.includes('auth/');
};

const isLogoutEndpoint = (endpoint: string) => {
  const normalized = endpoint.replace(/^\/+/, '');
  return normalized === 'auth/logout' || normalized.endsWith('/auth/logout');
};

const buildEndpointFromParams = (params: { endpoint: string[] } | undefined) => {
  const parts = params?.endpoint ?? [];
  return parts.join('/');
};

async function proxy(request: NextRequest, params: { endpoint: string[] }) {
  const endpoint = buildEndpointFromParams(params);
  const backendResponse = await requestBackend({ request, endpoint });

  const isLogoutSuccess = isLogoutEndpoint(endpoint) && backendResponse.ok;

  // 에러 응답시 백엔드의 메시지 로깅
  if (!backendResponse.ok) {
    try {
      const errorText = await backendResponse.clone().text();
      console.error(`[BFF -> Backend Error] URL: ${endpoint}, Status: ${backendResponse.status}`);
      console.error(`[BFF -> Backend Error Body]: ${errorText}`);
    } catch {
      console.error(`[BFF -> Backend Error] Failed to read error body for ${endpoint}`);
    }
  }

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

    if (isLogoutSuccess) {
      deleteAuthCookies(response);
    }

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

  if (isLogoutSuccess) {
    deleteAuthCookies(response);
    return response;
  }

  setAuthCookies(response, { accessToken: nextAccessToken, refreshToken: nextRefreshToken });

  return response;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ endpoint: string[] }> }) {
  try {
    return await proxy(request, await params);
  } catch (error) {
    console.error('[BFF ERROR] GET:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
export async function POST(request: NextRequest, { params }: { params: Promise<{ endpoint: string[] }> }) {
  try {
    return await proxy(request, await params);
  } catch (error) {
    console.error('[BFF ERROR] POST:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ endpoint: string[] }> }) {
  try {
    return await proxy(request, await params);
  } catch (error) {
    console.error('[BFF ERROR] PUT:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ endpoint: string[] }> }) {
  try {
    return await proxy(request, await params);
  } catch (error) {
    console.error('[BFF ERROR] PATCH:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ endpoint: string[] }> }) {
  try {
    return await proxy(request, await params);
  } catch (error) {
    console.error('[BFF ERROR] DELETE:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
