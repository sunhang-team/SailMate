'use client';

import { type ReactNode } from 'react';

import { Dropdown } from '@/components/ui/Dropdown';
import { useDropdown } from '@/components/ui/Dropdown/context';
import { ArrowIcon } from '@/components/ui/Icon/ArrowIcon';
import { cn } from '@/lib/cn';

const MAX_CATEGORIES = 3;

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

interface CategoryItem {
  label: string;
  value: number;
}

interface CategoryMultiSelectProps {
  icon: ReactNode;
  placeholder: string;
  selectedValues: number[];
  items: readonly CategoryItem[];
  onChange: (values: number[]) => void;
}

export function CategoryMultiSelect({ icon, placeholder, selectedValues, items, onChange }: CategoryMultiSelectProps) {
  const displayLabel =
    selectedValues.length === 0
      ? null
      : items
          .filter((item) => selectedValues.includes(item.value))
          .map((item) => item.label)
          .join(', ');

  const handleSelect = (value: number) => {
    if (selectedValues.length < MAX_CATEGORIES) {
      onChange([...selectedValues, value]);
    }
  };

  const handleRemove = (e: React.MouseEvent, value: number) => {
    e.stopPropagation();
    onChange(selectedValues.filter((v) => v !== value));
  };

  const handleReset = () => {
    onChange([]);
  };

  return (
    <Dropdown className='flex-1 **:[[role=listbox]]:w-full *:[button]:w-full'>
      <Dropdown.Trigger>
        <div className='flex w-full items-center justify-between px-5 py-4 md:px-7 md:py-5'>
          <div className='flex min-w-0 items-center gap-2'>
            {icon}
            <span
              className={cn(
                'text-small-01-r md:text-body-01-r truncate',
                displayLabel ? 'text-gray-900' : 'text-gray-400',
              )}
            >
              {displayLabel ?? placeholder}
            </span>
          </div>
          <RotatingArrow />
        </div>
      </Dropdown.Trigger>
      <Dropdown.Menu className='w-full min-w-[160px] overflow-hidden p-2'>
        <Dropdown.Item
          onClick={handleReset}
          className={cn(
            'cursor-pointer rounded-lg px-4 py-3 hover:bg-blue-100 hover:text-blue-400',
            selectedValues.length === 0 && 'bg-blue-100 text-blue-400',
          )}
        >
          전체
        </Dropdown.Item>
        {items.map((item) => {
          const isSelected = selectedValues.includes(item.value);
          const isDisabled = !isSelected && selectedValues.length >= MAX_CATEGORIES;

          return (
            <Dropdown.Item
              key={item.value}
              closeOnSelect={false}
              onClick={() => {
                if (isSelected) return;
                if (!isDisabled) handleSelect(item.value);
              }}
              className={cn(
                'flex cursor-pointer items-center justify-between rounded-lg px-4 py-3 hover:bg-blue-100 hover:text-blue-400',
                isSelected && 'bg-blue-100 text-blue-400',
                isDisabled && 'cursor-not-allowed opacity-40 hover:bg-transparent hover:text-inherit',
              )}
            >
              {item.label}
              {isSelected && (
                <button
                  type='button'
                  onClick={(e) => handleRemove(e, item.value)}
                  className='text-blue-400 hover:text-blue-600'
                >
                  &times;
                </button>
              )}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}
