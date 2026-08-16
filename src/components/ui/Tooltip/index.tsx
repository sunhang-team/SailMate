'use client';

import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

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

  const updatePosition = useCallback(() => {
    if (!containerRef.current || !panelRef.current) return;

    const triggerRect = containerRef.current.getBoundingClientRect();
    const panelRect = panelRef.current.getBoundingClientRect();

    const maxLeft = window.innerWidth - panelRect.width - VIEWPORT_MARGIN;
    const left = Math.max(Math.min(triggerRect.left, maxLeft), VIEWPORT_MARGIN);

    const maxTop = window.innerHeight - panelRect.height - VIEWPORT_MARGIN;
    const top = Math.max(Math.min(triggerRect.bottom + PANEL_GAP, maxTop), VIEWPORT_MARGIN);

    setPosition({ top, left });
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) close();
    };

    document.addEventListener('mousedown', handleClickOutside);
    // 스크롤/리사이즈 시 닫는 대신 위치를 다시 계산해 트리거에 계속 붙어있도록 유지
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition]);

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
