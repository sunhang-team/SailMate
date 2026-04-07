const decodeBase64Url = (input: string) => {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return typeof atob === 'function' ? atob(padded) : Buffer.from(padded, 'base64').toString('binary');
};

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
