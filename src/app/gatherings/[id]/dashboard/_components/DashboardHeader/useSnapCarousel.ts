import { useCallback, useEffect, useRef, useState } from 'react';

interface UseSnapCarouselOptions {
  pageCount: number;
}

export const useSnapCarousel = ({ pageCount }: UseSnapCarouselOptions) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const pageWidth = container.scrollWidth / pageCount;
    const newIndex = Math.round(container.scrollLeft / pageWidth);
    setActiveIndex(Math.min(newIndex, pageCount - 1));
  }, [pageCount]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToPage = useCallback(
    (index: number) => {
      const container = scrollRef.current;
      if (!container) return;

      const pageWidth = container.scrollWidth / pageCount;
      container.scrollTo({ left: pageWidth * index, behavior: 'smooth' });
    },
    [pageCount],
  );

  return { scrollRef, activeIndex, scrollToPage } as const;
};
