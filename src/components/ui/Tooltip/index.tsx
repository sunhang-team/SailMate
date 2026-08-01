'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/cn';

interface TooltipProps {
  /** 트리거 버튼의 접근성 라벨 */
  triggerLabel: string;
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
  panelClassName?: string;
}

const VIEWPORT_MARGIN = 16;
const PANEL_GAP = 8;

export function Tooltip({ triggerLabel, trigger, children, className, panelClassName }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    if (!isOpen || !containerRef.current || !panelRef.current) return;

    const triggerRect = containerRef.current.getBoundingClientRect();
    const maxLeft = window.innerWidth - panelRef.current.offsetWidth - VIEWPORT_MARGIN;
    const left = Math.max(Math.min(triggerRect.left, maxLeft), VIEWPORT_MARGIN);

    setPosition({ top: triggerRect.bottom + PANEL_GAP, left });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) close();
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={cn('relative inline-flex', className)}>
      <button
        type='button'
        onClick={toggle}
        aria-label={triggerLabel}
        aria-expanded={isOpen}
        className='inline-flex shrink-0 cursor-pointer'
      >
        {trigger}
      </button>
      {isOpen && (
        <div
          ref={panelRef}
          role='tooltip'
          style={position ?? undefined}
          className={cn(
            'fixed z-50 w-[min(320px,calc(100vw-2rem))] rounded-2xl bg-blue-500 p-5 shadow-(--shadow-03)',
            !position && 'invisible',
            panelClassName,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
