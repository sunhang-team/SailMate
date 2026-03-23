'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface MSWProviderProps {
  children: ReactNode;
}

const shouldEnableMsw = process.env.NEXT_PUBLIC_MSW_ENABLED === 'true';

export function MSWProvider({ children }: MSWProviderProps) {
  const [isReady, setIsReady] = useState(!shouldEnableMsw);

  useEffect(() => {
    if (!shouldEnableMsw) return;

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
