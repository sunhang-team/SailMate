import { decodeBase64Url } from './decodeBase64Url';

export const getExpirationDate = (jwt: string): Date | null => {
  const parts = jwt.split('.');
  if (parts.length < 2) return null;

  try {
    const payloadJson = decodeBase64Url(parts[1]);
    const payload = JSON.parse(payloadJson) as unknown;
    if (!payload || typeof payload !== 'object') return null;

    const exp = (payload as { exp?: unknown }).exp;
    if (typeof exp !== 'number') return null;

    return new Date(exp * 1000);
  } catch {
    return null;
  }
};
