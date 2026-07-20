'use client';

import { useState, type ComponentProps } from 'react';

import { Button } from '@/components/ui/Button';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { cn } from '@/lib/cn';

import { IOSInstallGuideBottomSheet } from './IOSInstallGuideBottomSheet';

type PWAInstallButtonProps = Omit<ComponentProps<typeof Button>, 'onClick' | 'children'>;

export function PWAInstallButton(buttonProps: PWAInstallButtonProps) {
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
      <Button
        onClick={handleClick}
        {...buttonProps}
        className={cn('text-body-02-m text-blue-300', buttonProps.className)}
      >
        앱 설치
      </Button>
      {isIOS && <IOSInstallGuideBottomSheet isOpen={isIOSGuideOpen} onClose={() => setIsIOSGuideOpen(false)} />}
    </>
  );
}
