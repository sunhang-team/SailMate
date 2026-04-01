'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/cn';

const TAB_ITEMS = [
  { id: 'description', label: '모임 설명' },
  { id: 'recruit-period', label: '모집 기간' },
  { id: 'activity-period', label: '활동 기간' },
  { id: 'goal', label: '모임 최종목표' },
  { id: 'weekly-plans', label: '주차별 계획' },
  { id: 'members', label: '모집 인원 현황' },
] as const;

type SectionId = (typeof TAB_ITEMS)[number]['id'];

const SCROLL_LOCK_MS = 500;

export function AnchorTabNav() {
  const [activeSectionId, setActiveSectionId] = useState<SectionId>(TAB_ITEMS[0].id);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;

        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length === 0) return;

        const topmost = visibleEntries.reduce((prev, curr) =>
          prev.boundingClientRect.top < curr.boundingClientRect.top ? prev : curr,
        );
        setActiveSectionId(topmost.target.id as SectionId);
      },
      {
        rootMargin: '-49px 0px -60% 0px',
        threshold: 0,
      },
    );

    TAB_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleTabClick = (sectionId: SectionId) => {
    isScrollingRef.current = true;
    setActiveSectionId(sectionId);

    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    setTimeout(() => {
      isScrollingRef.current = false;
    }, SCROLL_LOCK_MS);
  };

  return (
    <nav className='border-gray-150 bg-gray-0 border-b px-4 md:px-7 xl:px-30'>
      <div className='mx-auto max-w-[1680px]'>
        <ul className='scrollbar-none flex flex-nowrap gap-2 overflow-x-auto'>
          {TAB_ITEMS.map(({ id, label }) => {
            const isActive = activeSectionId === id;

            return (
              <li key={id} className='shrink-0'>
                <button
                  type='button'
                  onClick={() => handleTabClick(id)}
                  className={cn(
                    'text-small-02-m md:text-body-02-m flex h-[39px] shrink-0 items-center px-2.5 transition-colors md:h-12',
                    isActive ? 'border-b-2 border-gray-800 text-gray-800' : 'text-gray-300',
                  )}
                >
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
