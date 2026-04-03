'use client';

import { cn } from '@/lib/cn';
import { CheckIcon } from '@/components/ui/Icon/CheckIcon';

interface MemberTodoItemProps {
  content: string;
  isCompleted: boolean;
}

export function MemberTodoItem({ content, isCompleted }: MemberTodoItemProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-xl border border-gray-50 bg-white p-4 transition-all hover:bg-gray-50/50',
        isCompleted && 'bg-gray-25/50 border-gray-100',
      )}
    >
      <div className='flex items-center gap-5'>
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-blue-300 transition-colors md:h-12 md:w-12',
            isCompleted ? 'border-blue-300 bg-blue-300 text-white' : 'border-gray-200 bg-white',
          )}
        >
          {isCompleted && <CheckIcon className='h-8 w-8 md:h-12 md:w-12' />}
        </div>
        <span
          className={cn(
            'text-small-01-r md:text-body-01-r text-gray-900 transition-all',
            isCompleted && 'text-gray-400 line-through',
          )}
        >
          {content}
        </span>
      </div>
      <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-xl shadow-inner'>
        🔥
      </div>
    </div>
  );
}
