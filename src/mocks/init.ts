export const initMsw = async () => {
  if (process.env.NEXT_PUBLIC_MSW_ENABLED !== 'true') return;
  if (typeof window === 'undefined') return;

  const { worker } = await import('./browser');
  await worker.start({
    onUnhandledRequest: 'bypass',
  });
};
