'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface MSWProviderProps {
  children: ReactNode;
}

// prod에서는 NEXT_PUBLIC_MSW_ENABLED가 잘못 주입되더라도 MSW가 활성화되지 않도록 NODE_ENV로 이중 가드.
const shouldEnableMsw = process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_MSW_ENABLED === 'true';

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
