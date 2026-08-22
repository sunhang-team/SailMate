'use client';

import { useState } from 'react';

import { cn } from '@/lib/cn';
import { CheckIcon, FireButtonIcon } from '@/components/ui/Icon';

interface MemberTodoItemProps {
  content: string;
  isCompleted: boolean;
}

export function MemberTodoItem({ content, isCompleted }: MemberTodoItemProps) {
  const [isFired, setIsFired] = useState(false);

  return (
    <div
      className={cn(
        'border-gray-150 flex items-center justify-between rounded-xl border bg-gray-100 p-4 transition-all',
        isCompleted && 'bg-gray-25/50 border-gray-100',
      )}
    >
      <div className='flex items-center gap-5'>
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-blue-300 transition-colors md:h-12 md:w-12',
            isCompleted ? 'text-gray-0 border-blue-300 bg-blue-300' : 'border-gray-150 bg-gray-0',
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
      <button
        type='button'
        onClick={() => setIsFired((prev) => !prev)}
        className={cn(
          'text-small-02-sb md:text-body-02-sb flex h-8 shrink-0 cursor-pointer items-center gap-1 rounded-lg px-2 text-blue-300 transition-colors md:h-12 md:px-4',
          isFired ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-300',
        )}
      >
        <FireButtonIcon variant={isFired ? 'disabled' : 'active'} className='h-5 w-5 md:h-7 md:w-7' />
        {isFired ? '응원완료' : '응원하기'}
      </button>
    </div>
  );
}
