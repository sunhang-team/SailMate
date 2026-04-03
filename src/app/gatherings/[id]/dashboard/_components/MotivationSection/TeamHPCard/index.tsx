import { HPIcon } from '@/components/ui/Icon';

import { ProgressBar } from '../ProgressBar';
import { getHPColorClass } from '../utils';

interface TeamHPCardProps {
  hp: number;
}

export function TeamHPCard({ hp }: TeamHPCardProps) {
  const clampedHP = Math.min(100, Math.max(0, hp));
  const hpColorClass = getHPColorClass(clampedHP);

  return (
    <div className='rounded-2xl bg-gray-100 p-4 lg:p-6'>
      <div className='flex flex-col gap-3 lg:gap-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-1 lg:gap-2'>
            <HPIcon size={16} className='text-red-200 lg:h-6 lg:w-6' />
            <span className='text-small-01-sb lg:text-h5-sb text-gray-900'>팀 HP</span>
          </div>
          <span className={`text-small-01-sb md:text-body-01-sb lg:text-h5-sb ${hpColorClass}`}>
            {clampedHP}
            <span className='text-gray-600'>/100</span>
          </span>
        </div>

        <ProgressBar
          value={hp}
          trackClassName='bg-red-100'
          fillClassName='bg-gradient-dashboard-red'
          thumbClassName='bg-red-200'
        />

        <p className='lg:text-small-01-r text-small-02-r leading-[1.6] text-gray-600'>
          멤버가 목표 미달성 시, 팀 HP가 줄어들어요
        </p>
      </div>
    </div>
  );
}
