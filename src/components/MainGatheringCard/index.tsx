'use client';

import { Button } from '@/components/ui/Button';
import { GatheringCard } from '@/components/ui/GatheringCard';
import { HeartIcon, PersonIcon, StudyIcon, ProjectIcon } from '@/components/ui/Icon';
import { Tag } from '@/components/ui/Tag';
import { cn } from '@/lib/cn';
import { useLikeToggle } from '@/api/likes/hooks';

import type { GatheringListItem } from '@/api/gatherings/types';

interface MainGatheringCardProps {
  gathering: GatheringListItem;
  joinButtonLabel?: string;
  joinButtonClassName?: string;
  isJoinDisabled?: boolean;
  initialFavorite?: boolean;
  onJoin?: () => void;
  className?: string;
}

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

export function MainGatheringCard({
  gathering,
  joinButtonLabel = '참여하기',
  joinButtonClassName,
  isJoinDisabled = false,
  onJoin,
  className,
}: MainGatheringCardProps) {
  const { isLiked, toggleLike, isPending } = useLikeToggle(gathering.id);

  const totalWeeksLabel = toWeeksLabel(gathering.startDate, gathering.endDate);
  const deadlineLabel = `${toDeadlineDdayLabel(gathering.recruitDeadline)}`;

  return (
    <GatheringCard className={cn('flex h-full flex-col', className)}>
      <GatheringCard.Header className='items-center'>
        <Tag
          variant='category'
          icon={(() => {
            const Icon = TYPE_ICON[gathering.type as keyof typeof TYPE_ICON] || StudyIcon;
            return <Icon size={14} className='text-blue-200' />;
          })()}
          label={gathering.type}
          sublabel={gathering.categories.join(', ')}
        />
        <div className='text-small-01-sb flex items-center gap-1'>
          <PersonIcon size={16} className='text-blue-400' />
          <span className='text-blue-400'>{gathering.currentMembers}</span>
          <span className='text-gray-600'>/</span>
          <span className='text-gray-600'>{gathering.maxMembers}</span>
        </div>
      </GatheringCard.Header>
      <GatheringCard.Body className='mb-6 flex-1 gap-3'>
        <div className='flex flex-col gap-0.5'>
          <div className='flex flex-wrap gap-1'>
            {gathering.tags.map((tag) => (
              <span key={tag} className='text-small-02-r text-gray-500'>
                #{tag}
              </span>
            ))}
          </div>
          <p className='text-body-01-b line-clamp-2 text-gray-900'>{gathering.title}</p>
          <p className='text-small-01-r line-clamp-1 text-gray-800'>{gathering.shortDescription}</p>
        </div>
        <div className='flex items-center gap-1'>
          <Tag variant='duration'>{totalWeeksLabel}</Tag>
          <Tag variant='deadline' state='goal'>
            {deadlineLabel}
          </Tag>
        </div>
      </GatheringCard.Body>
      <GatheringCard.Footer className='border-gray-150 mt-auto items-center gap-2 border-t pt-4'>
        <Button
          variant='bookmark'
          size='bookmark-sm'
          data-selected={isLiked}
          aria-label='찜하기'
          aria-pressed={isLiked}
          disabled={isPending}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleLike();
          }}
        >
          <HeartIcon size={20} variant={isLiked ? 'filled' : 'outline'} />
        </Button>
        <Button
          variant='participation-outline-sm'
          size='participation-sm'
          className={cn('w-full', joinButtonClassName)}
          disabled={isJoinDisabled}
          onClick={onJoin}
        >
          {joinButtonLabel}
        </Button>
      </GatheringCard.Footer>
    </GatheringCard>
  );
}
