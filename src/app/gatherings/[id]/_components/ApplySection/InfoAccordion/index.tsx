'use client';

import { useState } from 'react';

import { cn } from '@/lib/cn';

import type { GatheringDetail } from '@/api/gatherings/types';
import { ArrowIcon, CategoryIcon, FlagIcon, CalendarIcon, PersonIcon } from '@/components/ui/Icon';
import { InfoRow } from './InfoRow';
import { DeadlineLabel } from '../DeadlineLabel';
import { formatDate, MILLISECONDS_IN_A_DAY } from '../utils/dateUtils';

const toWeeksLabel = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays = Math.max(0, Math.ceil((end.getTime() - start.getTime()) / MILLISECONDS_IN_A_DAY));
  const weeks = Math.max(1, Math.ceil(diffDays / 7));
  return `${weeks}주`;
};

interface InfoAccordionProps {
  data: GatheringDetail;
  defaultOpen?: boolean;
  className?: string;
}

export function InfoAccordion({ data, defaultOpen = true, className }: InfoAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const weeksLabel = toWeeksLabel(data.startDate, data.endDate);

  return (
    <div className={cn('border-gray-150 overflow-hidden rounded-xl border', className)}>
      <button
        type='button'
        className='text-body-02-sb bg-gray-150 flex w-full items-center justify-between px-5 py-4 text-blue-500 transition-colors hover:bg-gray-50'
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        모임 정보
        <ArrowIcon size={20} className={`rotate-90 text-gray-800 transition-transform ${isOpen ? 'rotate-270' : ''}`} />
      </button>

      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-200 ease-in-out',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className='overflow-hidden'>
          <ul className='border-gray-150 flex flex-col gap-3 border-t px-5 py-4'>
            <InfoRow icon={<CategoryIcon size={24} className='text-gray-800' />}>{data.category}</InfoRow>
            <InfoRow icon={<FlagIcon size={24} className='text-gray-800' />}>{data.goal}</InfoRow>
            <InfoRow icon={<CalendarIcon size={24} className='text-gray-800' />}>
              {formatDate(data.startDate)} ~ {formatDate(data.endDate)} · {weeksLabel}
            </InfoRow>
            <InfoRow icon={<CalendarIcon size={24} className='text-gray-800' />}>
              <span className='flex items-center gap-1 text-gray-700'>
                마감까지 <DeadlineLabel recruitDeadline={data.recruitDeadline} />
              </span>
            </InfoRow>
            <InfoRow icon={<PersonIcon size={24} className='text-gray-800' />}>
              <span className='text-gray-700'>{data.currentMembers}</span>
              <span className='text-gray-600'>/{data.maxMembers}명</span>
            </InfoRow>
          </ul>
        </div>
      </div>
    </div>
  );
}
