export const isJsonResponse = (contentType: string | null): boolean => {
  return !!contentType && contentType.toLowerCase().includes('application/json');
};

interface ExtractTokensResult {
  accessToken: string | null;
  refreshToken: string | null;
  stripped: unknown;
}

export const extractTokens = (json: unknown): ExtractTokensResult => {
  if (!json || typeof json !== 'object') return { accessToken: null, refreshToken: null, stripped: json };

  const obj = json as Record<string, unknown>;

  const accessToken =
    typeof obj.accessToken === 'string'
      ? obj.accessToken
      : obj.data &&
          typeof obj.data === 'object' &&
          typeof (obj.data as Record<string, unknown>).accessToken === 'string'
        ? ((obj.data as Record<string, unknown>).accessToken as string)
        : null;

  const refreshToken =
    typeof obj.refreshToken === 'string'
      ? obj.refreshToken
      : obj.data &&
          typeof obj.data === 'object' &&
          typeof (obj.data as Record<string, unknown>).refreshToken === 'string'
        ? ((obj.data as Record<string, unknown>).refreshToken as string)
        : null;

  if (!accessToken && !refreshToken) return { accessToken: null, refreshToken: null, stripped: json };

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
