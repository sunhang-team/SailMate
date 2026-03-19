import { create } from 'zustand';

import type { ReactNode } from 'react';

const DEFAULT_DURATION = 3000; // showToast의 duration 기본값

const timeoutIdsByToastId = new Map<string, ReturnType<typeof setTimeout>>();

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  variant?: ToastVariant;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

interface ToastState {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id'>, durationMs?: number) => string;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  showToast: (toast, durationMs = DEFAULT_DURATION) => {
    const id = crypto.randomUUID();
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));

    const timeoutId = setTimeout(() => {
      get().removeToast(id);
      timeoutIdsByToastId.delete(id);
    }, durationMs);
    timeoutIdsByToastId.set(id, timeoutId);

    return id;
  },
  removeToast: (id) => {
    const timeoutId = timeoutIdsByToastId.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutIdsByToastId.delete(id);
    }
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));
