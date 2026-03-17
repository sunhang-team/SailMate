import type { ErrorInfo, ReactNode } from 'react';

export interface SuspenseBoundaryProps {
  children: ReactNode;
  pendingFallback: ReactNode;
  errorFallback: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
  resetKeys?: unknown[];
}
