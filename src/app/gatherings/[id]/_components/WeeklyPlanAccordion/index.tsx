'use client';

import { useState } from 'react';

import type { WeeklyPlan } from '@/api/gatherings/types';
import { ArrowIcon } from '@/components/ui/Icon/ArrowIcon';
import { cn } from '@/lib/cn';
import { formatDateShort } from '@/lib/formatGatheringDate';

interface WeeklyPlanAccordionProps {
  weeklyPlans: WeeklyPlan[];
}

export function WeeklyPlanAccordion({ weeklyPlans }: WeeklyPlanAccordionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className='flex flex-col gap-3 xl:gap-6'>
      {weeklyPlans.map((plan, index) => {
        const isExpanded = expandedIndex === index;

        return (
          <div key={plan.week} className='overflow-hidden rounded-lg'>
            <button
              type='button'
              aria-expanded={isExpanded}
              onClick={() => handleToggle(index)}
              className='flex w-full cursor-pointer items-center justify-between rounded-lg bg-blue-50 px-4 py-3 xl:px-6 xl:py-5'
            >
              <div className='flex items-center gap-3 xl:gap-4'>
                <span className='text-body-02-sb text-gray-0 xl:text-body-01-sb flex h-7 w-7 items-center justify-center rounded-md bg-blue-400 xl:h-8 xl:w-8'>
                  {plan.week}
                </span>
                <div className='flex items-center gap-2 xl:gap-3'>
                  <span className='text-small-01-sb xl:text-body-01-sb text-blue-500'>{plan.title}</span>
                  <span className='text-small-02-r xl:text-small-01-r text-gray-500'>
                    {formatDateShort(plan.startDate)} ~ {formatDateShort(plan.endDate)}
                  </span>
                </div>
              </div>
              <ArrowIcon
                size={28}
                className={cn(
                  'text-gray-800 transition-transform duration-200 xl:h-8! xl:w-8!',
                  isExpanded ? 'rotate-90' : '-rotate-90',
                )}
                viewBox='0 0 16 16'
              />
            </button>

            <div
              className={cn(
                'grid transition-[grid-template-rows] duration-300 ease-in-out',
                isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className='overflow-hidden'>
                <div role='region' className='flex flex-col items-start px-6 xl:px-8'>
                  <div className='bg-blue-150 mx-[5px] h-[30px] w-px' />
                  <div className='flex items-center gap-4'>
                    <div className='bg-blue-150 h-3 w-3 shrink-0 rounded-full' />
                    <p className='text-body-02-r xl:text-body-01-r text-gray-800'>01. {plan.title}</p>
                  </div>
                  <div className='bg-blue-150 mx-[5px] h-[36px] w-px' />
                  <div className='flex items-center gap-4'>
                    <div className='bg-blue-150 h-3 w-3 shrink-0 rounded-full' />
                    <p className='text-body-02-r xl:text-body-01-r text-gray-800'>02. {plan.title}</p>
                  </div>
                  <div className='bg-blue-150 mx-[5px] h-[30px] w-px' />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
