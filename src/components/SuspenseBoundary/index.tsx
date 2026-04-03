'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import type { SuspenseBoundaryProps } from './types';

/**
 * Suspense(로딩) + ErrorBoundary(에러)를 통합한 래퍼 컴포넌트.
 * prefetch 없이 클라이언트에서 직접 데이터를 fetching하는 컴포넌트에 사용.
 *
 * @example
 * // 유저별 데이터 — 로딩 + 에러 둘 다 처리
 * <SuspenseBoundary
 *   pendingFallback={<Skeleton />}
 *   errorFallback={(error, reset) => <ErrorFallback error={error} onRetry={reset} />}
 *   onError={(error) => sendToSentry(error)}
 *   resetKeys={[userId]}
 * >
 *   <UserDataSection />
 * </SuspenseBoundary>
 */
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
