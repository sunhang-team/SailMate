'use client';

import { ReactNode, Suspense } from 'react';
import { QueryParamsProvider as Provider } from '@frontend-toolkit-js/hooks';
import { useNextAppAdapter } from '@frontend-toolkit-js/hooks/useQueryParams/adapters/next-app';

function QueryParamsProviderInner({ children }: { children: ReactNode }) {
  const adapter = useNextAppAdapter();
  return <Provider adapter={adapter}>{children}</Provider>;
}

export function QueryParamsProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <QueryParamsProviderInner>{children}</QueryParamsProviderInner>
    </Suspense>
  );
}
