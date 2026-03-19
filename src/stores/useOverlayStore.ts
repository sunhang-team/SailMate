import type { ReactNode } from 'react';

import { create } from 'zustand';

interface OverlayState {
  overlays: Map<string, ReactNode>;
  mount: (id: string, element: ReactNode) => void;
  unmount: (id: string) => void;
}

export const useOverlayStore = create<OverlayState>((set) => ({
  overlays: new Map(),
  mount: (id, element) =>
    set((state) => {
      const newMap = new Map(state.overlays);
      newMap.set(id, element);
      return { overlays: newMap };
    }),
  unmount: (id) =>
    set((state) => {
      const newMap = new Map(state.overlays);
      newMap.delete(id);
      return { overlays: newMap };
    }),
}));
