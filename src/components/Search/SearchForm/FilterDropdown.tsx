'use client';

import { type ReactNode } from 'react';

import { Dropdown } from '@/components/ui/Dropdown';
import { useDropdown } from '@/components/ui/Dropdown/context';
import { ArrowIcon } from '@/components/ui/Icon/ArrowIcon';
import { cn } from '@/lib/cn';

function RotatingArrow() {
  const { isOpen } = useDropdown();
  return (
    <ArrowIcon
      size={16}
      className={cn(
        'shrink-0 rotate-90 text-gray-800 transition-transform duration-200 md:size-6',
        isOpen && 'rotate-270',
      )}
    />
  );
}

interface FilterDropdownItem {
  label: string;
  value: string | null;
}

interface FilterDropdownProps {
  icon: ReactNode;
  placeholder: string;
  selectedValue: string | null;
  items: readonly FilterDropdownItem[];
  onSelect: (value: string | null) => void;
}

export function FilterDropdown({ icon, placeholder, selectedValue, items, onSelect }: FilterDropdownProps) {
  const selectedLabel = items.find((item) => item.value === selectedValue)?.label;

  return (
    <Dropdown className='flex-1 **:[[role=listbox]]:w-full *:[button]:w-full'>
      <Dropdown.Trigger>
        <div className='flex w-full items-center justify-between px-5 py-4 md:px-7 md:py-5'>
          <div className='flex items-center gap-2'>
            {icon}
            <span
              className={cn('text-small-01-r md:text-body-01-r', selectedValue ? 'text-gray-900' : 'text-gray-400')}
            >
              {selectedLabel ?? placeholder}
            </span>
          </div>
          <RotatingArrow />
        </div>
      </Dropdown.Trigger>
      <Dropdown.Menu className='flex w-full min-w-[160px] flex-col gap-1 overflow-hidden p-2'>
        {items.map((item) => {
          const isSelected = selectedValue === item.value;
          return (
            <Dropdown.Item
              key={item.label}
              onClick={() => onSelect(item.value)}
              className={cn(
                'lg:text-body-02-r cursor-pointer rounded-lg px-4 py-3 hover:bg-blue-100 hover:text-blue-400',
                isSelected && 'bg-blue-100 text-blue-400',
              )}
            >
              {item.label}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}
