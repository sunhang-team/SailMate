'use client';

import { IllustrationIcon, InfoIcon } from '@/components/ui/Icon';
import { ProgressBar } from '@/components/ui/Progress';
import { Tag } from '@/components/ui/Tag';

interface ActivityEnergySectionProps {
  reputationScore: number;
  reputationLabel: string | null;
  /** 태블릿 우측 컬럼 / 모바일·PC 하단 스택 */
  variant: 'tablet' | 'wide';
}

export function ActivityEnergySection({ reputationScore, reputationLabel, variant }: ActivityEnergySectionProps) {
  const labelText = reputationLabel || '참여 메이트';

  if (variant === 'tablet') {
    return (
      <div className='flex flex-col pb-7'>
        <div className='text-body-02-sb md:text-body-01-sb mb-5 flex items-center gap-2 text-gray-900 md:mb-6'>
          <span>내 활동 에너지</span>
          <InfoIcon className='size-4 shrink-0 text-gray-400 md:size-6' aria-label='활동 에너지 안내' />
        </div>
        <div className='mb-2 flex items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <span className='text-body-02-sb md:text-body-01-sb text-blue-300'>{reputationScore}점</span>
            <IllustrationIcon variant='fire' className='size-5 shrink-0 md:size-7' aria-hidden />
          </div>
          <Tag variant='mate' className='shrink-0'>
            {labelText}
          </Tag>
        </div>
        <ProgressBar value={reputationScore} barClassName='h-3 rounded-full bg-blue-100' className='gap-0' />
      </div>
    );
  }

  return (
    <div className='border-gray-150 mt-6 flex flex-col border-t pt-7'>
      <div className='text-body-01-sb mb-6 flex items-center gap-2 text-gray-900'>
        <span>내 활동 에너지</span>
        <InfoIcon className='size-6 shrink-0 text-gray-400' aria-label='활동 에너지 안내' />
      </div>
      <div className='mb-2 flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <span className='text-h5-sb text-blue-300'>{reputationScore}점</span>
          <IllustrationIcon variant='fire' className='size-8 shrink-0' aria-hidden />
        </div>
        <Tag variant='mate' className='shrink-0'>
          {labelText}
        </Tag>
      </div>
      <ProgressBar value={reputationScore} barClassName='h-3.5 rounded-full bg-blue-50' className='gap-0' />
    </div>
  );
}
