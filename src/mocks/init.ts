export const initMsw = async () => {
  if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_MSW_ENABLED !== 'true') return;
  if (typeof window === 'undefined') return;

  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      registrations
        .filter((registration) => {
          const worker = registration.active ?? registration.installing ?? registration.waiting;
          return worker && !worker.scriptURL.endsWith('/mockServiceWorker.js');
        })
        .map((registration) => registration.unregister()),
    );
  }

  const { worker } = await import('./browser');
  await worker.start({
    onUnhandledRequest: 'bypass',
  });
};
