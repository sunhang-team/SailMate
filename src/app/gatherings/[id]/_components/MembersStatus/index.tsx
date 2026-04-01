import { ProgressBar } from '@/components/ui/Progress';

interface MembersStatusProps {
  currentMembers: number;
  maxMembers: number;
}

const PERCENTAGE_MULTIPLIER = 100;

export function MembersStatus({ currentMembers, maxMembers }: MembersStatusProps) {
  const progressValue = maxMembers > 0 ? Math.round((currentMembers / maxMembers) * PERCENTAGE_MULTIPLIER) : 0;

  return (
    <div className='rounded-lg bg-blue-50 px-4 pt-6 pb-4 xl:px-6 xl:pt-10 xl:pb-8'>
      <ProgressBar value={progressValue} barClassName='h-3 xl:h-4'>
        <div className='flex items-center justify-between'>
          <span className='text-small-01-r xl:text-body-01-m text-gray-800'>인원</span>
          <p className='flex items-center gap-1'>
            <span>
              <span className='text-body-02-b xl:text-body-01-b text-blue-500'>{currentMembers}</span>
              <span className='text-body-02-r xl:text-body-01-r text-gray-600'>/{maxMembers}</span>
            </span>
            <span className='text-body-02-m xl:text-body-01-m text-gray-800'>명</span>
          </p>
        </div>
      </ProgressBar>
    </div>
  );
}
