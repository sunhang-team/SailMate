import { CloseIcon, IllustrationIcon } from '@/components/ui/Icon';
import type { IllustrationIconVariant } from '@/components/ui/Icon/IllustrationIcon';

import type { MatesTagCount } from '@/api/reviews/types';

const ENERGY_ITEMS: { label: string; variant: IllustrationIconVariant }[] = [
  { label: '연기', variant: 'smoke' },
  { label: '불씨', variant: 'firestart' },
  { label: '불꽃', variant: 'fire' },
  { label: '태양', variant: 'sun' },
];

interface ActivityEnergyCardProps {
  matesTagCounts: MatesTagCount[];
}

export function ActivityEnergyCard({ matesTagCounts }: ActivityEnergyCardProps) {
  const countMap = Object.fromEntries(matesTagCounts.map(({ tag, count }) => [tag, count]));
  return (
    <div className='border-gray-150 bg-gray-0 shadow-02 flex flex-col gap-4 rounded-lg border p-6'>
      <span className='text-body-02-sb md:text-h5-sb text-gray-900'>활동 에너지 평가</span>
      <div className='flex items-stretch rounded-lg bg-gray-100 px-4 py-3'>
        {ENERGY_ITEMS.map(({ label, variant }, index) => [
          index > 0 && (
            <span key={`divider-${variant}`} className='bg-gray-150 mx-2 w-px self-stretch md:mx-4' aria-hidden />
          ),
          <div key={variant} className='flex flex-1 flex-col items-center gap-1 md:flex-row md:justify-center md:gap-2'>
            <IllustrationIcon variant={variant} className='size-5 shrink-0 md:size-6' aria-hidden />
            <div className='flex items-center gap-1 md:contents'>
              <span className='text-small-02-sb md:text-body-02-sb lg:text-body-01-sb text-gray-800'>{label}</span>
              <CloseIcon className='size-3 text-gray-300 md:size-4' aria-hidden />
              <span className='text-small-02-r md:text-body-02-r lg:text-body-01-r text-gray-600'>
                {countMap[label] ?? 0}
              </span>
            </div>
          </div>,
        ])}
      </div>
    </div>
  );
}
