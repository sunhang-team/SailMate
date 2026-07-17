'use client';

import { useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';

import { usePWAInstall } from '@/hooks/usePWAInstall';
import { CloseIcon } from '@/components/ui/Icon';
import { IOSInstallGuideBottomSheet } from '@/components/PWAInstallButton/IOSInstallGuideBottomSheet';

const LANDING_PATHNAME = '/';
const PWA_BANNER_DISMISSED_KEY = 'pwa-install-banner-dismissed';

const noopSubscribe = () => () => {};
const getIsDismissedFromStorage = () => sessionStorage.getItem(PWA_BANNER_DISMISSED_KEY) === 'true';

export function PWAInstallBanner() {
  const pathname = usePathname();
  const { isIOS, promptInstall } = usePWAInstall();
  const [isManuallyDismissed, setIsManuallyDismissed] = useState(false);
  const [isIOSGuideOpen, setIsIOSGuideOpen] = useState(false);

  // sessionStorage는 마운트 시점에만 읽으면 되므로 subscribe는 no-op (변경 알림은 로컬 state로 처리)
  const isDismissedInSession = useSyncExternalStore(noopSubscribe, getIsDismissedFromStorage, () => false);
  const isDismissed = isManuallyDismissed || isDismissedInSession;

  const isVisible = pathname === LANDING_PATHNAME && !isDismissed;

  if (!isVisible) return null;

  const handleInstallClick = () => {
    if (isIOS) {
      setIsIOSGuideOpen(true);
      return;
    }
    void promptInstall();
  };

  const handleDismiss = () => {
    sessionStorage.setItem(PWA_BANNER_DISMISSED_KEY, 'true');
    setIsManuallyDismissed(true);
  };

  return (
    <>
      <div className='text-gray-0 flex h-18 items-center gap-3 bg-blue-500 px-4 md:px-7 xl:px-30'>
        <div className='flex min-w-0 flex-1 items-center justify-start gap-4 md:gap-6 lg:justify-center lg:gap-10'>
          <p className='text-small-01-m md:text-body-01-m min-w-0 truncate'>
            완성도를 <span className='font-semibold text-blue-200'>앱으로 설치</span>하고 바로 열기
          </p>
          <button
            type='button'
            onClick={handleInstallClick}
            className='text-small-02-m md:text-body-02-m bg-gray-0 shrink-0 rounded-md px-3 py-2 text-blue-300'
          >
            앱 설치하기
          </button>
        </div>
        <button
          type='button'
          aria-label='배너 닫기'
          onClick={handleDismiss}
          className='text-gray-0 flex h-6 w-6 shrink-0 items-center justify-center'
        >
          <CloseIcon size={24} />
        </button>
      </div>
      {isIOS && <IOSInstallGuideBottomSheet isOpen={isIOSGuideOpen} onClose={() => setIsIOSGuideOpen(false)} />}
    </>
  );
}
