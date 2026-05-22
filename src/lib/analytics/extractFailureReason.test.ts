import { AxiosError, AxiosHeaders } from 'axios';

import { extractFailureReason } from './extractFailureReason';

const createAxiosError = (data: unknown, message = 'Request failed') => {
  const headers = new AxiosHeaders();
  return new AxiosError(message, 'ERR_BAD_RESPONSE', undefined, undefined, {
    data,
    status: 400,
    statusText: 'Bad Request',
    headers,
    config: { headers },
  });
};

describe('lib/analytics/extractFailureReason', () => {
  it('axios 에러의 response.data.errorCode 가 있으면 그 값을 우선 사용한다', () => {
    const error = createAxiosError({ errorCode: 'EMAIL_ALREADY_EXISTS' });

    expect(extractFailureReason(error)).toBe('EMAIL_ALREADY_EXISTS');
  });

  it('axios 에러에 errorCode 가 없으면 message 를 사용한다', () => {
    const error = createAxiosError(undefined, 'Network Error');

    expect(extractFailureReason(error)).toBe('Network Error');
  });

  it('일반 Error 인스턴스는 message 를 사용한다', () => {
    expect(extractFailureReason(new Error('boom'))).toBe('boom');
  });

  it('string 을 그대로 전달하면 사유로 사용한다 (명시 reason 예: OAUTH_CANCELLED)', () => {
    expect(extractFailureReason('OAUTH_CANCELLED')).toBe('OAUTH_CANCELLED');
  });

  it('알 수 없는 형태의 에러는 "unknown" 으로 폴백한다', () => {
    expect(extractFailureReason(null)).toBe('unknown');
    expect(extractFailureReason(undefined)).toBe('unknown');
    expect(extractFailureReason(42)).toBe('unknown');
    expect(extractFailureReason({})).toBe('unknown');
  });

  it('reason 은 100자를 초과하지 않는다', () => {
    const longMessage = 'x'.repeat(500);

    const fromString = extractFailureReason(longMessage);
    const fromError = extractFailureReason(new Error(longMessage));
    const fromAxios = extractFailureReason(createAxiosError({ errorCode: longMessage }));

    expect(fromString).toHaveLength(100);
    expect(fromError).toHaveLength(100);
    expect(fromAxios).toHaveLength(100);
  });
});
