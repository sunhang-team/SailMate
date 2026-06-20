'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { usePWAInstall } from '@/hooks/usePWAInstall';

import { IOSInstallGuideBottomSheet } from './IOSInstallGuideBottomSheet';

interface PWAInstallButtonProps {
  className?: string;
}

export function PWAInstallButton({ className }: PWAInstallButtonProps) {
  const { isInstallable, isIOS, promptInstall } = usePWAInstall();
  const [isIOSGuideOpen, setIsIOSGuideOpen] = useState(false);

  const isVisible = isInstallable || isIOS;
  if (!isVisible) return null;

  const handleClick = () => {
    if (isIOS) {
      setIsIOSGuideOpen(true);
    } else {
      void promptInstall();
    }
  };

  return (
    <>
      <Button onClick={handleClick} className={className}>
        앱 설치
      </Button>
      {isIOS && <IOSInstallGuideBottomSheet isOpen={isIOSGuideOpen} onClose={() => setIsIOSGuideOpen(false)} />}
    </>
  );
}
