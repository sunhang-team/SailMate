import type { ApiResponse } from './types';

/** ApiResponse에서 data를 추출하고, null이면 에러를 throw */
export const unwrapResponse = <T>(response: ApiResponse<T>): T => {
  if (response.data === null || response.data === undefined) {
    throw new Error(response.message || '응답 데이터가 없습니다.');
  }
  return response.data;
};
