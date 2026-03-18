'use client';

import { ReactNode, Suspense } from 'react';
import { QueryParamsProvider as Provider } from '@frontend-toolkit-js/hooks';
import { useNextAppAdapter } from '@frontend-toolkit-js/hooks/useQueryParams/adapters/next-app';

interface QueryParamsProviderInnerProps {
  children: ReactNode;
}

function QueryParamsProviderInner({ children }: QueryParamsProviderInnerProps) {
  const adapter = useNextAppAdapter();
  return <Provider adapter={adapter}>{children}</Provider>;
}

interface QueryParamsProviderProps {
  children: ReactNode;
}

export function QueryParamsProvider({ children }: QueryParamsProviderProps) {
  return (
    <Suspense fallback={null}>
      <QueryParamsProviderInner>{children}</QueryParamsProviderInner>
    </Suspense>
  );
}
