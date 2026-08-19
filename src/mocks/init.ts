import { isMswEnabled } from '@/lib/msw';

const MSW_CONTROLLER_RELOAD_KEY = 'sailmate:msw-controller-reloaded';
const MSW_WORKER_FILE = '/mockServiceWorker.js';

const isControlledByMsw = () => navigator.serviceWorker.controller?.scriptURL.endsWith(MSW_WORKER_FILE) ?? false;

const reloadOnceForMswController = () => {
  if (isControlledByMsw()) {
    sessionStorage.removeItem(MSW_CONTROLLER_RELOAD_KEY);
    return false;
  }

  if (sessionStorage.getItem(MSW_CONTROLLER_RELOAD_KEY)) return false;

  sessionStorage.setItem(MSW_CONTROLLER_RELOAD_KEY, 'true');
  window.location.reload();
  return true;
};

export const initMsw = async () => {
  if (!isMswEnabled) return;
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

  if (reloadOnceForMswController()) return;
};
