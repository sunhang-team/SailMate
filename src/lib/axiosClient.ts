import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';

const REFRESH_PATH = '/auth/refresh-token';

const refreshClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

const isUnauthorized = (error: unknown) => {
  if (!axios.isAxiosError(error)) return false;
  return error.response?.status === 401;
};

export const axiosClient: AxiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (!isUnauthorized(error)) throw error;

    const config = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;
    if (!config || config._retry) throw error;

    const url = config.url ?? '';
    if (typeof url === 'string' && url.includes(REFRESH_PATH)) throw error;

    config._retry = true;

    try {
      await refreshClient.post(REFRESH_PATH);
      return await axiosClient.request(config);
    } catch (refreshError) {
      throw refreshError;
    }
  },
);
