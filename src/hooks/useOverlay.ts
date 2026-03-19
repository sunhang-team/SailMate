import { useEffect, useId, useRef, type ReactNode } from 'react';

import { useOverlayStore } from '@/stores/useOverlayStore';
import { OVERLAY_ANIMATION_DURATION } from '@/constants/overlay';

export const useOverlay = () => {
  const overlayId = useId();
  const { mount, unmount } = useOverlayStore();
  const countRef = useRef(0);
  const activeIds = useRef<Set<string>>(new Set());
  const timerIds = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  useEffect(() => {
    const currentActiveIds = activeIds.current;
    const currentTimerIds = timerIds.current;

    return () => {
      currentTimerIds.forEach(clearTimeout);
      currentTimerIds.clear();
      currentActiveIds.forEach((id) => {
        unmount(id);
      });
      currentActiveIds.clear();
    };
  }, [unmount]);

  return {
    open: <T = boolean>(render: (props: { isOpen: boolean; close: (value: T) => void }) => ReactNode): Promise<T> => {
      return new Promise((resolve) => {
        const currentId = `${overlayId}-${++countRef.current}`;
        activeIds.current.add(currentId);

        const close = (value: T) => {
          mount(currentId, render({ isOpen: false, close }));

          const timerId = setTimeout(() => {
            unmount(currentId);
            activeIds.current.delete(currentId);
            timerIds.current.delete(timerId);
            resolve(value);
          }, OVERLAY_ANIMATION_DURATION);
          timerIds.current.add(timerId);
        };

        mount(currentId, render({ isOpen: true, close }));
      });
    },
    closeAll: () => {
      timerIds.current.forEach(clearTimeout);
      timerIds.current.clear();
      activeIds.current.forEach((id) => unmount(id));
      activeIds.current.clear();
    },
  };
};
