import type { ApiResponse } from '@/api/common/types';

export const createApiResponse = <T>(data: T, message = 'Success'): ApiResponse<T> => ({
  success: true,
  data,
  message,
});
