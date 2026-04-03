import { type NextRequest } from 'next/server';

const ACCESS_TOKEN_COOKIE = 'accessToken';
const REFRESH_TOKEN_COOKIE = 'refreshToken';

interface ServerProxyRequestInit {
  method: string;
  headers: Headers;
  body?: ArrayBuffer;
}

const getBackendBaseUrl = () => {
  const baseUrl = process.env.BACKEND_BASE_URL;
  if (!baseUrl) throw new Error('BACKEND_BASE_URL is not defined');
  return baseUrl.replace(/\/+$/, '');
};

const buildBackendUrl = (endpoint: string, searchParams: URLSearchParams) => {
  const baseUrl = getBackendBaseUrl();
  const path = endpoint.replace(/^\/+/, '');
  const qs = searchParams.toString();
  return `${baseUrl}/${path}${qs ? `?${qs}` : ''}`;
};

const filterProxyHeaders = (headers: Headers) => {
  const nextHeaders = new Headers();
  headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (['host', 'connection', 'content-length'].includes(lower)) return;
    nextHeaders.set(key, value);
  });
  return nextHeaders;
};

export const createServerProxyRequestInit = async (request: NextRequest): Promise<ServerProxyRequestInit> => {
  const method = request.method.toUpperCase();
  const headers = filterProxyHeaders(request.headers);
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
  if (accessToken) headers.set('authorization', `Bearer ${accessToken}`);
  const body = method === 'GET' || method === 'HEAD' ? undefined : await request.arrayBuffer();
  return { method, headers, body };
};

/** 특정 엔드포인트에 대해 리프레시 토큰 주입이 필요한지 확인 */
const shouldInjectRefreshToken = (endpoint: string) => {
  const normalized = endpoint.replace(/^\/+/, '');
  return normalized.includes('auth/logout') || normalized.includes('auth/refresh');
};

export const requestBackend = async (params: { request: NextRequest; endpoint: string }) => {
  const init = await createServerProxyRequestInit(params.request);
  const url = buildBackendUrl(params.endpoint, params.request.nextUrl.searchParams);

  // auth/logout, auth/refresh 등의 엔드포인트인 경우 본문에 refreshToken 주입
  if (shouldInjectRefreshToken(params.endpoint) && init.method === 'POST') {
    const refreshToken = params.request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
    if (refreshToken) {
      try {
        let bodyObj: Record<string, unknown> = {};
        if (init.body && init.body.byteLength > 0) {
          const bodyStr = new TextDecoder().decode(init.body);
          bodyObj = JSON.parse(bodyStr);
        }
        bodyObj.refreshToken = refreshToken;
        const newBodyStr = JSON.stringify(bodyObj);
        init.body = new TextEncoder().encode(newBodyStr).buffer as ArrayBuffer;
        init.headers.set('content-type', 'application/json');
      } catch (error) {
        console.error('[BFF -> Backend] Failed to inject refreshToken:', error);
      }
    }
  }

  // DEBUG LOG
  console.log(`[BFF -> Backend] ${init.method} ${url}`);
  console.log(`[BFF -> Backend] Content-Type: ${init.headers.get('content-type')}`);
  console.log(`[BFF -> Backend] Body Size: ${init.body?.byteLength ?? 0} bytes`);
  console.log(`[BFF -> Backend] Auth Header: ${init.headers.get('authorization') ? 'Present' : 'None'}`);

  return await fetch(url, {
    method: init.method,
    headers: init.headers,
    body: init.body,
    redirect: 'manual',
    cache: 'no-store',
  });
};
