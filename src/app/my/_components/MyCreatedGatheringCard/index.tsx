'use client';

import Link from 'next/link';

import { GatheringCard } from '@/components/ui/GatheringCard';
import { CalendarIcon, StudyIcon, ProjectIcon } from '@/components/ui/Icon';
import { Tag } from '@/components/ui/Tag';
import { cn } from '@/lib/cn';
import { formatDateDot, getTotalWeeks } from '@/lib/formatGatheringDate';
import { getGatheringDisplayStatus } from '@/lib/gatheringStatus';

import type { MembershipGathering } from '@/api/memberships/types';

interface MyCreatedGatheringCardProps {
  gathering: MembershipGathering;
  className?: string;
}

const TYPE_ICON = {
  스터디: StudyIcon,
  프로젝트: ProjectIcon,
} as const;

export function MyCreatedGatheringCard({ gathering, className }: MyCreatedGatheringCardProps) {
  const startDotDate = formatDateDot(gathering.startDate);
  const endDotDate = formatDateDot(gathering.endDate);
  const weeks = getTotalWeeks(gathering.startDate, gathering.endDate);

  const pendingCount = gathering.pendingApplicationCount ?? 0;

  const { displayLabel, tagState } = getGatheringDisplayStatus(gathering);

  return (
    <Link href={`/gatherings/${gathering.id}`}>
      <GatheringCard className={cn('w-full transition-transform hover:-translate-y-1', className)}>
        <GatheringCard.Header className='mb-6 items-center'>
          <div className='flex gap-1'>
            <Tag
              variant='category'
              icon={(() => {
                const Icon = TYPE_ICON[gathering.type as keyof typeof TYPE_ICON] || StudyIcon;
                return <Icon size={14} className='text-blue-200' />;
              })()}
              label={gathering.type}
              sublabel={gathering.categories.join(', ')}
            />
            <Tag variant='status' state={tagState}>
              {displayLabel}
            </Tag>
          </div>
        </GatheringCard.Header>

        <GatheringCard.Body className='mb-0 gap-2'>
          <div className='flex flex-col'>
            <div className='flex flex-wrap gap-1'>
              {gathering.tags.slice(0, 2).map((tag) => (
                <span key={tag} className='text-small-02-r md:text-small-01-r text-gray-500'>
                  #{tag}
                </span>
              ))}
            </div>
            <div className='text-body-02-b md:text-body-01-b truncate text-gray-900'>{gathering.title}</div>
          </div>

          <div className='text-small-02-r md:text-small-01-r flex flex-wrap items-center gap-x-2 gap-y-1 text-gray-600'>
            <div className='flex shrink-0 items-center gap-2'>
              <CalendarIcon size={16} />
              <span className='whitespace-nowrap'>
                {startDotDate} ~ {endDotDate}
                <span className='mx-1'>・</span>
                <span className='whitespace-nowrap'>{weeks}주</span>
              </span>
            </div>
            <span className='text-small-02-r md:text-small-01-r text-gray-400'>|</span>
            <div className='flex shrink-0 items-center gap-2'>
              <ProjectIcon size={16} className='text-gray-600' />
              <div className='flex items-center'>
                <span className='text-small-02-r md:text-small-01-r text-gray-600'>{gathering.currentMembers}</span>
                <span className='text-small-02-r md:text-small-01-r text-gray-400'>/{gathering.maxMembers}</span>
              </div>
            </div>
          </div>
        </GatheringCard.Body>

        <GatheringCard.Footer className='mt-4'>
          <div className='border-gray-150 flex h-[54px] w-full items-center rounded-[8px] border bg-gray-100 md:h-[64px]'>
            <div className='flex flex-1 items-center justify-center gap-1.5'>
              <span className='text-small-01-m md:text-body-01-m text-gray-600'>모집 인원</span>
              <span className='flex items-center'>
                <span className='text-small-01-sb md:text-body-01-sb text-blue-300'>{gathering.currentMembers}</span>
                <span className='text-small-01-sb md:text-body-01-sb text-gray-700'>/{gathering.maxMembers}</span>
              </span>
            </div>
            <div className='bg-gray-150 h-6 w-px' />
            <div className='flex flex-1 items-center justify-center gap-1.5 text-blue-300'>
              <span className='text-small-01-m md:text-body-01-m text-gray-600'>신청대기</span>
              <span className='text-small-01-sb md:text-body-01-sb'>{pendingCount}</span>
            </div>
          </div>
        </GatheringCard.Footer>
      </GatheringCard>
    </Link>
  );
}
