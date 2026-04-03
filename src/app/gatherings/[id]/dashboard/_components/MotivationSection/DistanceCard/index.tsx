import { DistanceIcon } from '@/components/ui/Icon';

import { ProgressBar } from '../ProgressBar';

interface DistanceCardProps {
  distance: number;
  progress: number;
}

export function DistanceCard({ distance, progress }: DistanceCardProps) {
  return (
    <div className='rounded-2xl bg-gray-100 p-4 lg:p-6'>
      <div className='flex flex-col gap-3 lg:gap-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-1 lg:gap-2'>
            <DistanceIcon size={16} className='text-blue-300 lg:h-6 lg:w-6' />
            <span className='text-small-01-sb lg:text-h5-sb text-gray-900'>완성도까지 남은 거리</span>
          </div>
          <span className='md:text-body-01-sb text-small-01-sb lg:text-h5-b text-blue-300'>{distance}km</span>
        </div>

        <ProgressBar
          value={progress}
          trackClassName='bg-blue-100'
          fillClassName='bg-gradient-dashboard-blue'
          thumbClassName='bg-gradient-primary'
        />

        <p className='lg:text-small-01-r text-small-02-r leading-[1.6] text-gray-600'>
          팀 HP와 전체 달성률이 높을수록 남은 거리가 빠르게 줄어들어요
        </p>
      </div>
    </div>
  );
}
