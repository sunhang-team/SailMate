const decodeBase64Url = (input: string) => {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  const decoded = typeof atob === 'function' ? atob(padded) : Buffer.from(padded, 'base64').toString('binary');
  return decoded;
};

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
