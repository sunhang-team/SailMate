const MEETING_TOKEN_ERROR_MESSAGES: Record<string, string> = {
  MEMBER_REQUIRED: '모임 멤버만 회의에 참여할 수 있어요.',
  LOGIN_REQUIRED: '로그인 후 다시 시도해 주세요.',
  INVALID_ROOM_PARAM: '회의방 정보가 올바르지 않아요.',
  INVALID_ROOM_FORMAT: '회의방 정보가 올바르지 않아요.',
  INVALID_USER_INFO: '사용자 정보를 불러오지 못했어요. 다시 로그인해 주세요.',
  SERVER_MISCONFIG: '회의 서버 설정에 문제가 있어요. 잠시 후 다시 시도해 주세요.',
  UPSTREAM_ERROR: '회의 입장에 일시적인 문제가 발생했어요. 잠시 후 다시 시도해 주세요.',
};

const FALLBACK_TOKEN_ERROR_MESSAGE = '회의 토큰을 가져오는데 실패했습니다.';

export const getTokenErrorMessage = (errorCode: unknown): string => {
  if (typeof errorCode !== 'string') return FALLBACK_TOKEN_ERROR_MESSAGE;
  return MEETING_TOKEN_ERROR_MESSAGES[errorCode] ?? FALLBACK_TOKEN_ERROR_MESSAGE;
};
