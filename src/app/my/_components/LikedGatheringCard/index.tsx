'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { GatheringCard } from '@/components/ui/GatheringCard';
import { HeartIcon, PersonIcon, StudyIcon, ProjectIcon } from '@/components/ui/Icon';
import { Tag } from '@/components/ui/Tag';
import { cn } from '@/lib/cn';
import { getGatheringDisplayStatus } from '@/lib/gatheringStatus';

import type { GatheringListItem } from '@/api/gatherings/types';

const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;

const formatDate = (isoDate: string) => isoDate.slice(0, 10);

const TYPE_ICON = {
  스터디: StudyIcon,
  프로젝트: ProjectIcon,
} as const;

const toDeadlineDdayLabel = (recruitDeadline: string) => {
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const deadline = new Date(recruitDeadline);
  if (Number.isNaN(deadline.getTime())) {
    return `모집 마감 ${formatDate(recruitDeadline)}`;
  }
  const deadlineMidnight = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());
  const diffDays = Math.ceil((deadlineMidnight.getTime() - todayMidnight.getTime()) / MILLISECONDS_IN_A_DAY);

  return `모집 마감 D-${Math.max(0, diffDays)}`;
};

const toWeeksLabel = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays = Math.max(0, Math.ceil((end.getTime() - start.getTime()) / MILLISECONDS_IN_A_DAY));
  const weeks = Math.max(1, Math.ceil(diffDays / 7));
  return `총 ${weeks}주`;
};

interface LikedGatheringCardProps {
  gathering: GatheringListItem;
  onUnlike: () => void;
  isUnlikePending?: boolean;
  className?: string;
}

export function LikedGatheringCard({
  gathering,
  onUnlike,
  isUnlikePending = false,
  className,
}: LikedGatheringCardProps) {
  const router = useRouter();

  const display = getGatheringDisplayStatus({
    status: gathering.status,
    currentMembers: gathering.currentMembers,
    maxMembers: gathering.maxMembers,
    startDate: gathering.startDate,
    endDate: gathering.endDate,
    recruitDeadline: gathering.recruitDeadline,
  });

  const totalWeeksLabel = toWeeksLabel(gathering.startDate, gathering.endDate);
  const deadlineLabel = toDeadlineDdayLabel(gathering.recruitDeadline);

  const CategoryIcon = TYPE_ICON[gathering.type as keyof typeof TYPE_ICON] ?? StudyIcon;

  return (
    <GatheringCard className={cn('w-full', className)}>
      <GatheringCard.Header className='items-center'>
        <div className='flex flex-wrap gap-1'>
          <Tag
            variant='category'
            icon={<CategoryIcon size={14} className='text-blue-200' />}
            label={gathering.type}
            sublabel={gathering.categories.join(', ')}
          />
          <Tag variant='status' state={display.tagState}>
            {display.displayLabel}
          </Tag>
        </div>
        <div className='text-small-01-sb flex items-center gap-1'>
          <PersonIcon size={16} className='text-blue-400' />
          <span className='text-blue-400'>{gathering.currentMembers}</span>
          <span className='text-gray-600'>/</span>
          <span className='text-gray-600'>{gathering.maxMembers}</span>
        </div>
      </GatheringCard.Header>
      <GatheringCard.Body className='mb-4'>
        <div className='flex flex-col'>
          <div className='flex flex-wrap gap-1'>
            {gathering.tags.map((tag) => (
              <span key={tag} className='text-small-02-r text-gray-500'>
                #{tag}
              </span>
            ))}
          </div>
          <p className='text-body-01-b mb-0.5 text-gray-900'>{gathering.title}</p>
          <p className='text-small-01-r text-gray-800'>{gathering.shortDescription}</p>
        </div>
        <div className='flex items-center gap-1'>
          <Tag variant='duration'>{totalWeeksLabel}</Tag>
          <Tag variant='deadline' state='goal'>
            {deadlineLabel}
          </Tag>
        </div>
      </GatheringCard.Body>
      <GatheringCard.Footer className='border-gray-150 hap-1 items-center border-t pt-4 md:gap-2'>
        <Button
          type='button'
          variant='bookmark'
          size='bookmark-lg'
          data-selected
          aria-label='찜 해제'
          aria-pressed
          disabled={isUnlikePending}
          onClick={onUnlike}
        >
          <HeartIcon size={27} variant='filled' className='text-red-200 md:size-9' />
        </Button>
        <Button
          type='button'
          variant='participation-outline'
          size='participation'
          className='w-full min-w-0 flex-1'
          disabled={!display.isJoinable}
          onClick={() => router.push(`/gatherings/${gathering.id}`)}
        >
          참여하기
        </Button>
      </GatheringCard.Footer>
    </GatheringCard>
  );
}
