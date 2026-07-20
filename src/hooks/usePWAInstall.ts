import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

import { useMediaQuery } from '@/hooks/useMediaQuery';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface Window {
    // layout.tsx의 beforeInteractive 스크립트가 하이드레이션 전에 캡처해두는 이벤트.
    // beforeinstallprompt는 페이지 로드 초반에 발생해 useEffect 등록보다 먼저 지나갈 수 있어
    // 이 전역 변수로 미리 잡아둔다.
    __deferredInstallPrompt?: BeforeInstallPromptEvent;
  }
}

const noopSubscribe = () => () => {};

export const usePWAInstall = () => {
  const [latestPrompt, setLatestPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const isStandalone = useMediaQuery('(display-mode: standalone)');

  // userAgent는 세션 중 바뀌지 않으므로 subscribe는 no-op
  const isIOSDetected = useSyncExternalStore(
    noopSubscribe,
    () => /iphone|ipad|ipod/i.test(navigator.userAgent),
    () => false,
  );

  // beforeinstallprompt는 하이드레이션 전에 발생할 수 있어, layout.tsx의 beforeInteractive
  // 스크립트가 미리 캡처해둔 값을 SSR-safe하게 읽는다(초기값 null로 하이드레이션 불일치 방지).
  const precapturedPrompt = useSyncExternalStore(
    noopSubscribe,
    () => window.__deferredInstallPrompt ?? null,
    () => null,
  );

  const deferredPrompt = latestPrompt ?? precapturedPrompt;

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setLatestPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setLatestPrompt(null);
      delete window.__deferredInstallPrompt;
    }
  }, [deferredPrompt]);

  return {
    isInstallable: !!deferredPrompt && !isStandalone,
    isIOS: isIOSDetected && !isStandalone,
    isStandalone,
    promptInstall,
  };
};
