'use client';

import { createPortal } from 'react-dom';

import { cn } from '@/lib/cn';

import { Toast } from './index';
import { useToastStore } from './useToastStore';

import type { ReactNode } from 'react';

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const { toasts, removeToast } = useToastStore();
  const portalRoot = typeof document !== 'undefined' ? document.body : null;

  return (
    <>
      {children}
      {portalRoot &&
        createPortal(
          <div className={cn('pointer-events-none fixed top-4 right-4 z-50 flex flex-col gap-2')}>
            {toasts.map((toast) => (
              <div key={toast.id} className='pointer-events-auto'>
                <Toast
                  variant={toast.variant}
                  title={toast.title}
                  description={toast.description}
                  action={toast.action}
                  onClose={() => removeToast(toast.id)}
                />
              </div>
            ))}
          </div>,
          portalRoot,
        )}
    </>
  );
}
