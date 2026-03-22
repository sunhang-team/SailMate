'use client';

import { ReactNode } from 'react';

import { cn } from '@/lib/cn';

import { useDropdown } from './context';

interface ItemProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  closeOnSelect?: boolean;
}
export function Item({ children, onClick, className, closeOnSelect = true }: ItemProps) {
  const { close } = useDropdown();

  const handleClick = () => {
    onClick?.();
    if (closeOnSelect) close();
  };
  return (
    <li
      role='option'
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
        if (e.key === 'Escape') close();
      }}
      onClick={handleClick}
      className={cn('transition-colors', className)}
    >
      {children}
    </li>
  );
}
