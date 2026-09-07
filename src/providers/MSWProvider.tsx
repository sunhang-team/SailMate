'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import { isMswEnabled } from '@/lib/msw';

interface MSWProviderProps {
  children: ReactNode;
}

export function MSWProvider({ children }: MSWProviderProps) {
  const [isReady, setIsReady] = useState(!isMswEnabled);

  useEffect(() => {
    if (!isMswEnabled) return;

    const init = async () => {
      const { initMsw } = await import('@/mocks/init');
      await initMsw();
      setIsReady(true);
    };

    init();
  }, []);

  if (!isReady) return null;

  return <>{children}</>;
}
