'use client';

import { useState } from 'react';

import { ArrowIcon } from '@/components/ui/Icon/ArrowIcon';
import { Profile } from '@/components/ui/Profile';
import { cn } from '@/lib/cn';
import { StateIcon } from '@/components/ui/Icon';
import { Tag } from '@/components/ui/Tag';

import { MemberTodoGrid } from '../MemberTodoGrid';

import type { Member } from '@/api/memberships/types';
import type { Todo } from '@/api/todos/types';

interface MemberTodoAccordionProps {
  member: Member;
  todos: Todo[];
}

export function MemberTodoAccordion({ member, todos }: MemberTodoAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  // 디자인 시안에 따른 임시 배지 로직 (D-day 및 주의)
  const isWarning = member.userId % 3 === 0; // 임시 조건
  const dDay = 14; // 임시 값

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border transition-all duration-300',
        isOpen ? 'bg-blue-25/10 border-blue-100 shadow-lg' : 'border-gray-50 bg-white hover:border-gray-200',
      )}
    >
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className='flex w-full cursor-pointer items-center justify-between p-4 md:px-6 md:py-5'
        aria-expanded={isOpen}
      >
        <div className='flex items-center gap-3 md:gap-5'>
          <Profile imageUrl={member.profileImage} className='size-8 rounded-lg shadow-sm md:size-12' />

          <div className='flex items-center gap-1 md:flex-row md:items-center md:gap-4'>
            <span className='text-small-01-m md:text-body-01-m text-gray-900'>{member.nickname}</span>
          </div>
        </div>
        <div className='flex items-center gap-2 md:gap-4'>
          {isWarning ? (
            <span className='text-small-02-sb inline-flex items-center gap-1 rounded-[4px] bg-orange-50 px-2 py-0.5 text-orange-400'>
              <Tag variant='info' state='bad'>
                <StateIcon variant='warning' size={14} />
                주의
              </Tag>
            </span>
          ) : (
            <span className='text-small-02-sb inline-flex items-center gap-1 rounded-[4px] bg-blue-50 px-2 py-0.5 text-blue-400'>
              <Tag variant='info' state='good'>
                <StateIcon variant='active' size={14} />
                {dDay}일
              </Tag>
            </span>
          )}
          <p className='text-small-01-r md:text-body-01-r mr-3 flex gap-1 whitespace-nowrap text-gray-900'>
            달성률
            <span className='text-small-01-sb md:text-body-01-sb flex items-center font-semibold text-blue-300'>
              {member.overallAchievementRate}%
            </span>
          </p>

          <ArrowIcon
            size={24}
            className={cn(
              'h-6 w-6 text-gray-400 transition-transform duration-300 md:size-7 md:h-8 md:w-8',
              isOpen ? 'rotate-90 text-blue-500' : '-rotate-90',
            )}
          />
        </div>
      </button>

      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-300 ease-in-out',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className='overflow-hidden'>
          <div className='bg-gray-25/50 border-t border-gray-50 p-4 md:p-6'>
            <MemberTodoGrid todos={todos} />
          </div>
        </div>
      </div>
    </div>
  );
}
