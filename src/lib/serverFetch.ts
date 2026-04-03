import { type NextRequest } from 'next/server';

const ACCESS_TOKEN_COOKIE = 'accessToken';

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

export const requestBackend = async (params: { request: NextRequest; endpoint: string }) => {
  const init = await createServerProxyRequestInit(params.request);
  const url = buildBackendUrl(params.endpoint, params.request.nextUrl.searchParams);

  return await fetch(url, {
    method: init.method,
    headers: init.headers,
    body: init.body,
    redirect: 'manual',
    cache: 'no-store',
  });
};
