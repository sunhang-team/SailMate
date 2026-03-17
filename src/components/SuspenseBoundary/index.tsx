import { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import type { SuspenseBoundaryProps } from './types';

export function SuspenseBoundary({
  children,
  pendingFallback,
  errorFallback,
  onError,
  onReset,
  resetKeys,
}: SuspenseBoundaryProps) {
  return (
    <ErrorBoundary fallback={errorFallback} onError={onError} onReset={onReset} resetKeys={resetKeys}>
      <Suspense fallback={pendingFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}
