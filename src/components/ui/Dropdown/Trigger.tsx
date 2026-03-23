'use client';

import { ReactNode, useRef } from 'react';
import type { KeyboardEvent } from 'react';

import { OVERLAY_ANIMATION_DURATION } from '@/constants/overlay';
import { cn } from '@/lib/cn';

import { useDropdown } from './context';

interface TriggerProps {
  children: ReactNode;
}

export function Trigger({ children }: TriggerProps) {
  const { toggle, isOpen, close } = useDropdown();
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' && isOpen) {
      e.preventDefault();
      const firstItem = triggerRef.current?.closest('[data-dropdown]')?.querySelector('[role="option"]') as HTMLElement;
      firstItem?.focus();
    }
    if (e.key === 'Tab' && isOpen) {
      close();
    }
  };

  return (
    <button
      ref={triggerRef}
      type='button'
      aria-expanded={isOpen}
      aria-haspopup='listbox'
      onClick={toggle}
      onKeyDown={handleKeyDown}
      style={{ transitionDuration: `${OVERLAY_ANIMATION_DURATION}ms` }}
      className={cn('border transition-colors', isOpen ? 'border-black' : 'border-transparent')}
    >
      {children}
    </button>
  );
}
