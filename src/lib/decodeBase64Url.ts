export const decodeBase64Url = (input: string) => {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return typeof atob === 'function' ? atob(padded) : Buffer.from(padded, 'base64').toString('binary');
};
