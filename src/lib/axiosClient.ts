import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';

const REFRESH_PATH = '/auth/refresh';

const refreshClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// TODO: 백엔드에서 인증 없는 요청에 401 통일 후 500 조건 제거
const shouldAttemptRefresh = (error: unknown) => {
  if (!axios.isAxiosError(error)) return false;
  const status = error.response?.status;
  if (status === 401) return true;
  if (status === 500 && !error.config?.headers?.Authorization) return true;
  return false;
};

let refreshPromise: Promise<unknown> | null = null;

export const axiosClient: AxiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true,
  paramsSerializer: (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, String(v)));
      } else if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    return searchParams.toString();
  },
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.data) {
      const data = error.response.data;
      if (typeof data === 'object' && data !== null && 'message' in data) {
        error.message = String((data as Record<string, unknown>).message);
      } else if (typeof data === 'string') {
        try {
          const parsed = JSON.parse(data);
          if (parsed.message) error.message = String(parsed.message);
        } catch {
          // JSON 파싱 실패 시 기존 error.message 유지
        }
      }
    }
    if (!shouldAttemptRefresh(error)) throw error;

    const config = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;
    if (!config || config._retry) throw error;

    const url = config.url ?? '';
    if (typeof url === 'string' && url.includes(REFRESH_PATH)) throw error;

    config._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshClient.post(REFRESH_PATH).finally(() => {
          refreshPromise = null;
        });
      }
      await refreshPromise;
      return await axiosClient.request(config);
    } catch {
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
      throw error;
    }
  },
);
