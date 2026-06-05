'use client';

import Image from 'next/image';

import { Button } from '@/components/ui/Button';
import { HandIcon } from '@/components/ui/Icon';
import { ProgressBar } from '@/components/ui/Progress';
import { useFallbackImage } from '@/hooks/useFallbackImage';

import { MemberBadge, MIN_WEEKS_FOR_WARNING, WARNING_THRESHOLD } from '../../MemberBadge';
import { RankBadge } from '../RankBadge';

import type { AchievementRankingItem } from '@/api/achievements/types';

interface RankingItemProps {
  item: AchievementRankingItem;
  isMe: boolean;
  streakDays: number;
  currentWeek: number;
}

export function RankingItem({ item, isMe, streakDays, currentWeek }: RankingItemProps) {
  const { imgSrc, onError } = useFallbackImage(item.profileImage);
  const isWarning = item.overallRate < WARNING_THRESHOLD && currentWeek >= MIN_WEEKS_FOR_WARNING;

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl bg-gray-100 px-7 py-5 ${isMe ? 'border-gradient-primary' : ''}`}
    >
      <RankBadge rank={item.rank} />

      <div className='relative h-8 w-8 shrink-0 overflow-hidden rounded-lg md:h-12 md:w-12'>
        <Image src={imgSrc} alt={`${item.nickname} 프로필 이미지`} fill className='object-cover' onError={onError} />
      </div>

      <div className='min-w-0 flex-1'>
        <ProgressBar value={item.overallRate}>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1 md:gap-2'>
              <span className='text-small-02-m md:text-body-01-m text-gray-900'>{item.nickname}</span>
              {isWarning && <MemberBadge type='warning' label='주의' />}
              {!isWarning && streakDays > 0 && <MemberBadge type='streak' label={`${streakDays}일`} />}
            </div>
            <div className='flex shrink-0 items-center gap-1'>
              <span className='text-small-02-r md:text-body-01-r text-gray-900'>달성률</span>
              <span className='text-small-02-sb md:text-body-01-sb text-blue-300'>{item.overallRate}%</span>
            </div>
          </div>
        </ProgressBar>
      </div>

      {isMe && (
        <Button variant='tag' size='tag' className='h-8 w-8 cursor-default md:h-12 md:w-12'>
          나
        </Button>
      )}

      {!isMe && (
        <Button variant='icon-hand' size='icon-hand' className='h-8 w-8 md:h-12 md:w-12'>
          <HandIcon />
        </Button>
      )}
    </div>
  );
}
