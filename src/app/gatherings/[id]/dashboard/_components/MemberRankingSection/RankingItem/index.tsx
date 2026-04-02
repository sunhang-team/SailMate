import { Button } from '@/components/ui/Button';
import { HandIcon, StateIcon } from '@/components/ui/Icon';
import { ProgressBar } from '@/components/ui/Progress';
import { Tag } from '@/components/ui/Tag';

import { RankBadge } from '../RankBadge';

import type { AchievementRankingItem } from '@/api/achievements/types';

interface RankingItemProps {
  item: AchievementRankingItem;
  isMe: boolean;
}

const WARNING_THRESHOLD = 50;

// 프로필 이미지 로드 실패 시 보여줄 회색 빈 SVG (base64 인코딩)
const FALLBACK_IMAGE =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNFMkU4RjAiLz48L3N2Zz4=';

export function RankingItem({ item, isMe }: RankingItemProps) {
  const isWarning = item.overallRate < WARNING_THRESHOLD;

  return (
    <div className={`flex items-center gap-3 rounded-2xl bg-gray-100 p-3 ${isMe ? 'border border-blue-300' : ''}`}>
      <RankBadge rank={item.rank} />

      <div className='h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gray-200'>
        {/* next/image는 onError를 안정적으로 지원하지 않아 <img> 사용 */}
        <img
          src={item.profileImage}
          alt={`${item.nickname} 프로필 이미지`}
          className='h-full w-full object-cover'
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
        />
      </div>

      <div className='min-w-0 flex-1'>
        <ProgressBar value={item.overallRate}>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span className='text-body-01-m text-gray-900'>{item.nickname}</span>
              {isWarning ? (
                <Tag variant='deadline' state='warning'>
                  ⚠ 주의
                </Tag>
              ) : (
                <Tag variant='deadline' state='goal' className='flex gap-1'>
                  <StateIcon variant='active' size={16} />
                  14일
                </Tag>
              )}
            </div>
            <div className='flex shrink-0 items-center gap-1'>
              <span className='text-body-01-r text-gray-900'>달성률</span>
              <span className='text-body-01-sb text-blue-300'>{item.overallRate}%</span>
            </div>
          </div>
        </ProgressBar>
      </div>

      {isMe && (
        <Button variant='tag' size='tag'>
          나
        </Button>
      )}

      {!isMe && (
        <Button variant='icon-hand' size='icon-hand' disabled>
          <HandIcon />
        </Button>
      )}
    </div>
  );
}
