import { FlagIcon } from '@/components/ui/Icon/FlagIcon';

interface StreakBadgeProps {
  streakDays: number;
}

export function StreakBadge({ streakDays }: StreakBadgeProps) {
  return (
    <div className='flex h-20 items-center justify-center gap-3 rounded-2xl bg-blue-50'>
      <FlagIcon size={16} className='shrink-0 text-blue-300 md:hidden' />
      <FlagIcon size={28} className='hidden shrink-0 text-blue-300 md:block' />
      <span className='text-small-01-sb md:text-body-01-sb lg:text-h5-sb text-blue-300'>
        {streakDays}일 연속 달성 중
      </span>
    </div>
  );
}
