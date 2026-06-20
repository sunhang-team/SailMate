import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

import { useMediaQuery } from '@/hooks/useMediaQuery';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const noopSubscribe = () => () => {};

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const isStandalone = useMediaQuery('(display-mode: standalone)');

  // userAgent는 세션 중 바뀌지 않으므로 subscribe는 no-op
  const isIOSDetected = useSyncExternalStore(
    noopSubscribe,
    () => /iphone|ipad|ipod/i.test(navigator.userAgent),
    () => false,
  );

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  return {
    isInstallable: !!deferredPrompt && !isStandalone,
    isIOS: isIOSDetected && !isStandalone,
    isStandalone,
    promptInstall,
  };
};
