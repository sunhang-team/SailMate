'use client';

import { CheckIcon } from '@/components/ui/Icon/CheckIcon';
import { cn } from '@/lib/cn';

const SORT_OPTIONS = [
  { label: '인기순', value: 'popular' },
  { label: '마감 임박 순', value: 'deadline' },
  { label: '최근등록순', value: 'latest' },
] as const;

interface SortFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function SortFilter({ value, onChange }: SortFilterProps) {
  return (
    <div className='flex items-center gap-2 md:gap-4'>
      {SORT_OPTIONS.map((option, index) => {
        const isSelected = value === option.value;
        return (
          <div key={option.value} className='flex items-center gap-2 md:gap-4'>
            {index > 0 && <span className='text-small-02-r md:text-body-02-r text-gray-500'>|</span>}
            <button
              type='button'
              onClick={() => onChange(option.value)}
              className={cn(
                'text-small-02-r md:text-body-02-r flex cursor-pointer items-center gap-0.5',
                isSelected ? 'font-semibold text-gray-800' : 'text-gray-500',
              )}
            >
              <CheckIcon size={16} className={cn('md:size-6', !isSelected && 'hidden')} />
              {option.label}
            </button>
          </div>
        );
      })}
    </div>
  );
}
