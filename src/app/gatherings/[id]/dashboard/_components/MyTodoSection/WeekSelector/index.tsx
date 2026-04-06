'use client';

import { useMemo } from 'react';

import { Dropdown } from '@/components/ui/Dropdown';
import { ArrowIcon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';

interface WeekSelectorProps {
  week: number;
  totalWeeks: number;
  onChange: (week: number) => void;
  className?: string;
}

export function WeekSelector({ week, totalWeeks, onChange, className }: WeekSelectorProps) {
  const weeks = useMemo(() => Array.from({ length: totalWeeks }, (_, idx) => idx + 1), [totalWeeks]);

  return (
    <Dropdown className={cn(className)}>
      <Dropdown.Trigger>
        <span className='text-small-02-m lg:text-body-01-m md:text-body-02-m inline-flex max-h-10 items-center gap-1 rounded-lg bg-blue-100 px-3 py-1 text-blue-300 md:gap-1.5 lg:gap-2'>
          {week}주차
          <ArrowIcon size={16} className='rotate-90 text-blue-300 md:size-4' />
        </span>
      </Dropdown.Trigger>

      <Dropdown.Menu containerClassName='left-0 w-full' className='max-h-64 w-full overflow-auto py-1'>
        {weeks.map((w) => (
          <Dropdown.Item
            key={w}
            onClick={() => onChange(w)}
            className={cn(
              'text-body-02-r flex cursor-pointer items-center justify-between px-3 py-2 text-gray-900',
              w === week && 'bg-gray-50',
            )}
          >
            <span>{w}주차</span>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
