import { useEffect, useRef, useState } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

interface UseElementInViewOnceOptions {
  threshold?: number;
  rootMargin?: string;
}

export const useElementInViewOnce = (options?: UseElementInViewOnceOptions) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const threshold = options?.threshold ?? 0.12;
  const rootMargin = options?.rootMargin ?? '0px 0px -8% 0px';

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    const reveal = () => {
      queueMicrotask(() => {
        setIsVisible(true);
      });
    };

    if (typeof IntersectionObserver === 'undefined') {
      reveal();
      return;
    }

    const media = window.matchMedia(REDUCED_MOTION_QUERY);
    if (media.matches) {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return { ref, isVisible };
};
