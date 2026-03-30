'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { GatheringCard } from '@/components/ui/GatheringCard';
import { HeartIcon, PersonIcon, StudyIcon } from '@/components/ui/Icon';
import { Tag } from '@/components/ui/Tag';
import { cn } from '@/lib/cn';

interface MainGatheringCardProps {
  category: string;
  subcategory: string;
  currentMembers: number;
  maxMembers: number;
  tags: string[];
  title: string;
  subtitle: string;
  totalWeeksLabel: string;
  deadlineLabel: string;
  joinButtonLabel?: string;
  joinButtonClassName?: string;
  isJoinDisabled?: boolean;
  initialFavorite?: boolean;
  onJoin?: () => void;
  className?: string;
}

export function MainGatheringCard({
  category,
  subcategory,
  currentMembers,
  maxMembers,
  tags,
  title,
  subtitle,
  totalWeeksLabel,
  deadlineLabel,
  joinButtonLabel = '참여하기',
  joinButtonClassName,
  isJoinDisabled = false,
  initialFavorite = false,
  onJoin,
  className,
}: MainGatheringCardProps) {
  // 찜은 클라이언트에서 토글. 서버와 맞추려면 API 성공 후 부모가 key를 바꾸거나 props를 갱신하는 식으로 동기화
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  return (
    <GatheringCard className={cn('w-[430px] p-8', className)}>
      <GatheringCard.Header className='items-center'>
        <Tag
          variant='category'
          icon={<StudyIcon size={14} className='text-blue-200' />}
          label={category}
          sublabel={subcategory}
        />
        <div className='text-small-01-sb flex items-center gap-1'>
          <PersonIcon size={16} className='text-blue-400' />
          <span className='text-blue-400'>{currentMembers}</span>
          <span className='text-gray-600'>/</span>
          <span className='text-gray-600'>{maxMembers}</span>
        </div>
      </GatheringCard.Header>
      <GatheringCard.Body className='mb-6 gap-6'>
        <div className='flex flex-col gap-1'>
          <div className='flex flex-wrap gap-x-1 gap-y-0.5'>
            {tags.map((tag) => (
              <span key={tag} className='text-small-02-m text-gray-500'>
                #{tag}
              </span>
            ))}
          </div>
          <p className='text-h5-b text-gray-900'>{title}</p>
          <p className='text-body-02-m text-gray-800'>{subtitle}</p>
        </div>
        <div className='flex items-center gap-1'>
          <Tag variant='duration'>{totalWeeksLabel}</Tag>
          <Tag variant='deadline' state='goal'>
            {deadlineLabel}
          </Tag>
        </div>
      </GatheringCard.Body>
      <GatheringCard.Footer className='border-gray-150 items-center border-t pt-4'>
        <Button
          variant='bookmark'
          size='bookmark-sm'
          data-selected={isFavorite}
          aria-label='찜하기'
          aria-pressed={isFavorite}
          onClick={() => setIsFavorite((prev) => !prev)}
        >
          <HeartIcon size={20} variant={isFavorite ? 'filled' : 'outline'} />
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
