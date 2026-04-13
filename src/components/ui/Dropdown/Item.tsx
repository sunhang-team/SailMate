'use client';

import { ReactNode } from 'react';

import { cn } from '@/lib/cn';

import { useDropdown } from './context';

interface ItemProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  closeOnSelect?: boolean;
  disabled?: boolean;
}
export function Item({ children, onClick, className, closeOnSelect = true, disabled = false }: ItemProps) {
  const { close } = useDropdown();

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    if (closeOnSelect) close();
  };
  return (
    <li
      role='option'
      tabIndex={-1}
      aria-disabled={disabled}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
        if (e.key === 'Escape') close();
      }}
      onClick={handleClick}
      className={cn('transition-colors', disabled && 'cursor-not-allowed opacity-40', className)}
    >
      {children}
    </li>
  );
}
