import { decodeBase64Url } from './decodeBase64Url';

export const getUserIdFromToken = (token: string | undefined): number | null => {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;

  try {
    const payload = JSON.parse(decodeBase64Url(parts[1])) as { sub?: string };
    return payload.sub ? Number(payload.sub) : null;
  } catch {
    return null;
  }
};
