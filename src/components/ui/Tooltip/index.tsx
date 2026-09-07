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

interface TooltipPosition {
  top: number;
  left: number;
  arrowLeft: number;
}

const VIEWPORT_MARGIN = 16;
const PANEL_GAP = 12;
// 피그마 실측: 트리거 중심 → 패널 왼쪽 끝 122px(아이콘 왼쪽 기준) + 아이콘 반폭 12px
const ARROW_APEX_OFFSET = 134;
const ARROW_HALF_WIDTH = 10;
const ARROW_HEIGHT = 10;
const ARROW_CORNER_MARGIN = 16; // 패널 둥근 모서리(rounded-2xl)를 침범하지 않기 위한 최소 여백
const ARROW_VISUAL_NUDGE = 10; // 패널 위치·클램프 계산에는 영향 없이, 화살표만 시각적으로 왼쪽으로 이동
const HOVER_CLOSE_DELAY = 150;
// 마우스(호버) 입력이 주 입력 수단인 기기(PC)를 판별. 터치스크린 기기는 false로 판별되어 클릭 인터랙션으로 대체됨
const HOVER_MEDIA_QUERY = '(hover: hover) and (pointer: fine)';

export function Tooltip({ triggerLabel, trigger, children, className, panelClassName }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHoverDevice, setIsHoverDevice] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(HOVER_MEDIA_QUERY).matches,
  );
  const [position, setPosition] = useState<TooltipPosition | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const close = () => setIsOpen(false);

  const clearCloseTimeout = () => {
    if (!closeTimeoutRef.current) return;
    clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = null;
  };

  const handleTriggerClick = () => {
    if (isHoverDevice) return;
    setIsOpen((prev) => !prev);
  };

  const handleHoverOpen = () => {
    if (!isHoverDevice) return;
    clearCloseTimeout();
    setIsOpen(true);
  };

  const handleHoverClose = () => {
    if (!isHoverDevice) return;
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(close, HOVER_CLOSE_DELAY);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia(HOVER_MEDIA_QUERY);

    const handleChange = (e: MediaQueryListEvent) => setIsHoverDevice(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => clearCloseTimeout, []);

  const updatePosition = useCallback(() => {
    if (!containerRef.current || !panelRef.current) return;

    const triggerRect = containerRef.current.getBoundingClientRect();
    const panelRect = panelRef.current.getBoundingClientRect();

    // 화살표 끝이 패널 왼쪽에서 ARROW_APEX_OFFSET만큼 떨어진 자리에 오도록, 그 지점이 트리거 중심과 겹치게 패널 left를 역산
    const triggerCenter = triggerRect.left + triggerRect.width / 2;
    const idealLeft = triggerCenter - ARROW_APEX_OFFSET;
    const maxLeft = window.innerWidth - panelRect.width - VIEWPORT_MARGIN;
    const left = Math.max(Math.min(idealLeft, maxLeft), VIEWPORT_MARGIN);

    const top = Math.max(triggerRect.bottom + PANEL_GAP, VIEWPORT_MARGIN);

    // 뷰포트 경계에 막혀 left가 클램프된 경우에도 화살표는 가능한 범위 내에서 트리거 중심을 따라가되, 둥근 모서리는 침범하지 않음
    const minArrowLeft = ARROW_HALF_WIDTH + ARROW_CORNER_MARGIN;
    const maxArrowLeft = panelRect.width - ARROW_HALF_WIDTH - ARROW_CORNER_MARGIN;
    const arrowLeft = Math.min(Math.max(triggerCenter - left, minArrowLeft), maxArrowLeft);

    setPosition({ top, left, arrowLeft });
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const handleOutsideInteraction = (e: MouseEvent | TouchEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) close();
    };

    // 패널 내부 스크롤은 유지하고, 외부(페이지) 스크롤 시에만 닫음
    const handleScroll = (e: Event) => {
      if (panelRef.current?.contains(e.target as Node)) return;
      close();
    };

    document.addEventListener('mousedown', handleOutsideInteraction);
    document.addEventListener('touchstart', handleOutsideInteraction);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      document.removeEventListener('mousedown', handleOutsideInteraction);
      document.removeEventListener('touchstart', handleOutsideInteraction);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition]);

  return (
    <div
      ref={containerRef}
      className={cn('relative inline-flex', className)}
      onMouseEnter={handleHoverOpen}
      onMouseLeave={handleHoverClose}
      onFocus={handleHoverOpen}
      onBlur={handleHoverClose}
    >
      <button
        type='button'
        onClick={handleTriggerClick}
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
          style={position ? { top: position.top, left: position.left } : undefined}
          className={cn('fixed z-50', !position && 'invisible')}
          onMouseEnter={handleHoverOpen}
          onMouseLeave={handleHoverClose}
        >
          {position && (
            <span
              aria-hidden
              className='absolute'
              style={{
                top: -ARROW_HEIGHT,
                left: position.arrowLeft - ARROW_VISUAL_NUDGE,
                width: 0,
                height: 0,
                borderLeft: `${ARROW_HALF_WIDTH}px solid transparent`,
                borderRight: `${ARROW_HALF_WIDTH}px solid transparent`,
                borderBottom: `${ARROW_HEIGHT}px solid var(--color-blue-500)`,
              }}
            />
          )}
          <div
            className={cn(
              'w-[min(320px,calc(100vw-2rem))] overflow-hidden rounded-2xl bg-blue-500 p-8 shadow-(--shadow-03)',
              panelClassName,
            )}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
