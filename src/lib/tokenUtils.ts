export const isJsonResponse = (contentType: string | null): boolean => {
  return !!contentType && contentType.toLowerCase().includes('application/json');
};

interface ExtractTokensResult {
  accessToken: string | null;
  refreshToken: string | null;
  stripped: unknown;
}

// 내부 헬퍼 함수
const findTokenInObject = (obj: Record<string, unknown>, key: 'accessToken' | 'refreshToken'): string | null => {
  // Top-level에서 찾기
  if (typeof obj[key] === 'string') {
    return obj[key] as string;
  }

  // data 객체 내부에서 찾기
  if (obj.data && typeof obj.data === 'object') {
    const data = obj.data as Record<string, unknown>;
    if (typeof data[key] === 'string') {
      return data[key] as string;
    }
  }

  return null;
};

export const extractTokens = (json: unknown): ExtractTokensResult => {
  if (!json || typeof json !== 'object') {
    return { accessToken: null, refreshToken: null, stripped: json };
  }

  const obj = json as Record<string, unknown>;

  const accessToken = findTokenInObject(obj, 'accessToken');
  const refreshToken = findTokenInObject(obj, 'refreshToken');

  if (!accessToken && !refreshToken) {
    return { accessToken: null, refreshToken: null, stripped: json };
  }

  const strippedTop = { ...obj };
  delete strippedTop.accessToken;
  delete strippedTop.refreshToken;

  if (strippedTop.data && typeof strippedTop.data === 'object') {
    const data = strippedTop.data as Record<string, unknown>;
    const nextData = { ...data };
    delete nextData.accessToken;
    delete nextData.refreshToken;
    strippedTop.data = nextData;
  }

  return { accessToken, refreshToken, stripped: strippedTop };
};
