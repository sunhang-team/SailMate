'use client';

import { Dropdown } from '@/components/ui/Dropdown';
import { useDropdown } from '@/components/ui/Dropdown/context';
import { ArrowIcon } from '@/components/ui/Icon/ArrowIcon';
import { cn } from '@/lib/cn';

const STATUS_OPTIONS = [
  { label: '모집중', value: 'RECRUITING' },
  { label: '전체', value: 'ALL' },
] as const;

function RotatingArrow() {
  const { isOpen } = useDropdown();
  return (
    <ArrowIcon
      size={16}
      className={cn(
        'shrink-0 rotate-90 text-gray-800 transition-transform duration-200 md:size-5',
        isOpen && 'rotate-270',
      )}
    />
  );
}

type StatusValue = (typeof STATUS_OPTIONS)[number]['value'];

interface StatusFilterProps {
  value: StatusValue;
  onChange: (value: StatusValue) => void;
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  const selectedLabel = STATUS_OPTIONS.find((o) => o.value === value)?.label ?? '모집중';

  return (
    <Dropdown className='**:[[role=listbox]]:right-0'>
      <Dropdown.Trigger>
        <div className='flex items-center gap-2'>
          <span className='text-small-02-m md:text-body-02-m text-gray-800'>{selectedLabel}</span>
          <RotatingArrow />
        </div>
      </Dropdown.Trigger>
      <Dropdown.Menu className='flex min-w-[100px] flex-col gap-2 overflow-hidden p-2'>
        {STATUS_OPTIONS.map((option) => {
          const isSelected = value === option.value;
          return (
            <Dropdown.Item
              key={option.value}
              onClick={() => onChange(option.value)}
              className={cn(
                'cursor-pointer rounded-lg px-4 py-2 hover:bg-blue-100 hover:text-blue-400',
                isSelected && 'bg-blue-100 text-blue-400',
              )}
            >
              {option.label}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}
