import Image from 'next/image';

import { Button } from '@/components/ui/Button';
import { HandIcon, StateIcon } from '@/components/ui/Icon';
import { ProgressBar } from '@/components/ui/Progress';
import { Tag } from '@/components/ui/Tag';
import { DEFAULT_PROFILE_IMAGE, normalizeImageUrl } from '@/constants/image';

import { RankBadge } from '../RankBadge';

import type { AchievementRankingItem } from '@/api/achievements/types';

interface RankingItemProps {
  item: AchievementRankingItem;
  isMe: boolean;
}

const WARNING_THRESHOLD = 50;

export function RankingItem({ item, isMe }: RankingItemProps) {
  const isWarning = item.overallRate < WARNING_THRESHOLD;

  return (
    <div className={`flex items-center gap-3 rounded-2xl bg-gray-100 p-3 ${isMe ? 'border border-blue-300' : ''}`}>
      <RankBadge rank={item.rank} />

      <div className='relative h-8 w-8 shrink-0 overflow-hidden rounded-lg md:h-12 md:w-12'>
        <Image
          src={normalizeImageUrl(item.profileImage)}
          alt={`${item.nickname} 프로필 이미지`}
          fill
          className='object-cover'
          onError={(e) => {
            // next/image의 onError는 브라우저 네이티브 이벤트 객체를 전달합니다.
            (e.target as HTMLImageElement).src = DEFAULT_PROFILE_IMAGE;
          }}
        />
      </div>

      <div className='min-w-0 flex-1'>
        <ProgressBar value={item.overallRate}>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1 md:gap-2'>
              <span className='text-small-02-m md:text-body-01-m text-gray-900'>{item.nickname}</span>
              {isWarning ? (
                <Tag
                  variant='deadline'
                  state='warning'
                  className='md:text-small-02-m h-[17px] w-[40px] px-1.5 py-0 text-[10px] md:h-[27px] md:w-[66px] md:px-3 md:py-1'
                >
                  ⚠ 주의
                </Tag>
              ) : (
                <Tag
                  variant='deadline'
                  state='goal'
                  className='md:text-small-02-m gap-0.3 flex h-[17px] w-10 px-1.5 py-0 text-[10px] md:h-[27px] md:w-[66px] md:gap-1 md:px-3 md:py-1'
                >
                  <StateIcon variant='active' className='h-3 w-3 md:h-4 md:w-4' />
                  14일
                </Tag>
              )}
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
