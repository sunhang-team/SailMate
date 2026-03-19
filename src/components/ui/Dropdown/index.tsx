'use client';

import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

// context
interface DropdownContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

const DropdownContext = createContext<DropdownContextType | null>(null);

const useDropdown = () => {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error('Dropdown 내부에서만 사용 가능');
  return ctx;
};

// base
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
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <DropdownContext.Provider value={{ isOpen, toggle, close }}>
      <div ref={containerRef} className={cn('relative inline-block', className)}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

// trigger
interface TriggerProps {
  children: ReactNode;
}

function Trigger({ children }: TriggerProps) {
  const { toggle, isOpen } = useDropdown();
  return (
    <button
      type='button'
      aria-expanded={isOpen}
      aria-haspopup='listbox'
      onClick={toggle}
      className={cn(isOpen && 'border border-black')}
    >
      {children}
    </button>
  );
}

// menu
interface MenuProps {
  children: ReactNode;
  className?: string;
}

function Menu({ children, className }: MenuProps) {
  const { isOpen } = useDropdown();
  if (!isOpen) return null;

  return (
    <div role='listbox' className={cn('absolute mt-2', className)}>
      <ul>{children}</ul>
    </div>
  );
}

// item
interface ItemProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}
function Item({ children, onClick, className }: ItemProps) {
  const { close } = useDropdown();

  const handleClick = () => {
    onClick?.();
    close(); // 선택하면 자동 닫기
  };
  return (
    <li
      role='option'
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
        if (e.key === 'Escape') close();
      }}
      onClick={handleClick}
      className={cn(className)}
    >
      {children}
    </li>
  );
}

// export
export const Dropdown = Object.assign(DropdownBase, {
  Trigger,
  Menu,
  Item,
});
