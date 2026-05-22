import axios from 'axios';

const MAX_REASON_LENGTH = 100;

// GA4 의 `*_failed` 이벤트는 reason 파라미터를 카디널리티 안전한 짧은 문자열로 받는다.
// 호출처에서 매번 분기/슬라이스하지 않도록 추출 로직을 한 곳에 모은다.
export const extractFailureReason = (error: unknown): string => {
  if (typeof error === 'string') return error.slice(0, MAX_REASON_LENGTH);

  if (axios.isAxiosError(error)) {
    const errorCode = error.response?.data?.errorCode;
    if (typeof errorCode === 'string' && errorCode.length > 0) return errorCode.slice(0, MAX_REASON_LENGTH);
    if (error.message) return error.message.slice(0, MAX_REASON_LENGTH);
  }

  if (error instanceof Error && error.message) return error.message.slice(0, MAX_REASON_LENGTH);

  return 'unknown';
};
