import { differenceInDays, startOfDay } from 'date-fns';

import { formatDateDot, getCurrentWeek } from '@/lib/formatGatheringDate';

import { GatheringCard } from '@/components/ui/GatheringCard';
import { CalendarIcon, ProjectIcon, ReviewIcon, StudyIcon } from '@/components/ui/Icon';
import { ProgressBar } from '@/components/ui/Progress';
import { Tag } from '@/components/ui/Tag';
import type { GatheringStatus, MembershipGathering } from '@/api/memberships/types';

interface MyGatheringsCardProps {
  gathering: MembershipGathering;
}

const TYPE_ICON = {
  스터디: StudyIcon,
  프로젝트: ProjectIcon,
} as const;

const STATUS_TAG_STATE: Record<GatheringStatus, 'recruiting' | 'progressing' | 'completed'> = {
  RECRUITING: 'recruiting',
  IN_PROGRESS: 'progressing',
  COMPLETED: 'completed',
};

const STATUS_LABEL: Record<GatheringStatus, string> = {
  RECRUITING: '모집중',
  IN_PROGRESS: '진행중',
  COMPLETED: '진행완료',
};

export function MyGatheringsCard({ gathering }: MyGatheringsCardProps) {
  const now = startOfDay(new Date());
  const startDate = new Date(gathering.startDate);
  const endDate = new Date(gathering.endDate);

  const totalDays = differenceInDays(endDate, startDate);
  const totalWeeks = Math.max(1, Math.ceil((totalDays + 1) / 7));
  const passedDays = differenceInDays(now, startDate);
  const progressRate = totalDays > 0 ? Math.min(100, Math.max(0, Math.floor((passedDays / totalDays) * 100))) : 0;

  const Icon = TYPE_ICON[gathering.type as keyof typeof TYPE_ICON] ?? ProjectIcon;
  const hasReviewed = !!gathering.hasReviewed;

  return (
    <GatheringCard>
      <GatheringCard.Header className='items-start'>
        <div className='flex gap-1'>
          <Tag
            variant='category'
            icon={<Icon size={14} className='text-blue-200' />}
            label={gathering.type}
            sublabel={gathering.categories.join(', ')}
          />
          <Tag variant='status' state={STATUS_TAG_STATE[gathering.status]}>
            {STATUS_LABEL[gathering.status]}
          </Tag>
        </div>
      </GatheringCard.Header>
      <GatheringCard.Body>
        <div>
          <div className='flex gap-1'>
            {gathering.tags.slice(0, 2).map((tag) => (
              <span key={tag} className='text-small-02-r md:text-small-01-r text-gray-500'>
                #{tag}
              </span>
            ))}
          </div>
          <div className='text-body-02-b md:text-body-01-b text-gray-900'>{gathering.title}</div>
          <div className='mt-2 flex items-center gap-2'>
            <CalendarIcon size={16} className='text-gray-600' />
            <div className='flex items-center gap-1'>
              <span className='text-small-02-r md:text-small-01-r text-gray-600'>
                {formatDateDot(gathering.startDate)} ~ {formatDateDot(gathering.endDate)}
              </span>
              <span className='text-small-02-r md:text-small-01-r text-gray-600'>・</span>
              <span className='text-small-02-r md:text-small-01-r text-gray-600'>{totalWeeks}주</span>
            </div>
            <span className='text-small-02-r md:text-small-01-r text-gray-400'>|</span>
            <ProjectIcon size={16} className='text-gray-600' />
            <div className='flex items-center'>
              <span className='text-small-02-r md:text-small-01-r text-gray-600'>{gathering.currentMembers}</span>
              <span className='text-small-02-r md:text-small-01-r text-gray-400'>/{gathering.maxMembers}</span>
            </div>
          </div>
          <ProgressBar label='달성률' layout='horizontal' value={progressRate} className='mb-4' />
        </div>
      </GatheringCard.Body>
      <GatheringCard.Footer>
        {gathering.status === 'IN_PROGRESS' && (
          <div className='border-gray-150 flex h-[54px] w-full items-center rounded-[8px] border bg-gray-100 md:h-[72px]'>
            <div className='flex flex-1 items-center justify-center gap-1.5'>
              <span className='text-small-01-m md:text-body-01-m text-gray-600'>총</span>
              <span className='text-small-01-sb md:text-body-01-sb text-blue-300'>{totalWeeks}주</span>
            </div>
            <div className='bg-gray-150 h-6 w-px' />
            <div className='flex flex-1 items-center justify-center gap-1.5'>
              <span className='text-small-01-sb md:text-body-01-sb text-blue-300'>
                {getCurrentWeek(gathering.startDate)}주차
              </span>
              <span className='text-small-01-m md:text-body-01-m text-gray-600'>진행중</span>
            </div>
          </div>
        )}
        {gathering.status === 'COMPLETED' && !hasReviewed && (
          <div className='flex h-[54px] w-full items-center justify-center rounded-[8px] bg-blue-50 md:h-[72px]'>
            <div className='flex items-center gap-2'>
              <ReviewIcon size={16} className='text-blue-300 md:size-6' />
              <span className='text-small-01-sb md:text-body-01-sb text-blue-300'>리뷰 쓰기</span>
            </div>
          </div>
        )}
        {gathering.status === 'COMPLETED' && hasReviewed && (
          <div className='flex h-[54px] w-full items-center justify-center rounded-[8px] bg-blue-50 md:h-[72px]'>
            <span className='text-small-01-sb md:text-body-01-sb text-gray-600'>리뷰 작성완료</span>
          </div>
        )}
      </GatheringCard.Footer>
    </GatheringCard>
  );
}
