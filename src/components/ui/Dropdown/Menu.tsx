'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

import { OVERLAY_ANIMATION_DURATION } from '@/constants/overlay';
import { cn } from '@/lib/cn';

import { useDropdown } from './context';

interface MenuProps {
  children: ReactNode;
  className?: string;
}

export function Menu({ children, className }: MenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { isOpen, close } = useDropdown();
  const [shouldRender, setShouldRender] = useState(isOpen);

  if (isOpen && !shouldRender) setShouldRender(true);

  useEffect(() => {
    if (!isOpen && shouldRender) {
      const timer = setTimeout(() => setShouldRender(false), OVERLAY_ANIMATION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  if (!shouldRender) return null;

  const handleKeyDown = (e: KeyboardEvent) => {
    const items = Array.from(menuRef.current?.querySelectorAll('[role="option"]') ?? []) as HTMLElement[];
    const currentIndex = items.indexOf(document.activeElement as HTMLElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(currentIndex + 1) % items.length]?.focus();
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[(currentIndex - 1 + items.length) % items.length]?.focus();
    }
    if (e.key === 'Tab') {
      close();
    }
  };

  return (
    <div
      ref={menuRef}
      role='listbox'
      onKeyDown={handleKeyDown}
      className={cn('absolute mt-2', isOpen ? 'animate-modal-fade-in' : 'animate-modal-fade-out', className)}
    >
      <ul>{children}</ul>
    </div>
  );
}
