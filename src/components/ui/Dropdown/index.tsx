'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/cn';

import { DropdownContext } from './context';
import { Trigger } from './Trigger';
import { Menu } from './Menu';
import { Item } from './Item';

interface DropdownProps {
  children: ReactNode;
  className?: string;
}

function DropdownBase({ children, className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <DropdownContext.Provider value={{ isOpen, toggle, close }}>
      <div ref={containerRef} data-dropdown className={cn('relative inline-block', className)}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export const Dropdown = Object.assign(DropdownBase, {
  Trigger,
  Menu,
  Item,
});
