import { StateIcon } from '@/components/ui/Icon';
import { Tag } from '@/components/ui/Tag';

export const WARNING_THRESHOLD = 50;
export const MIN_WEEKS_FOR_WARNING = 2;

interface MemberBadgeProps {
  type: 'streak' | 'warning';
  label: string;
}

export function MemberBadge({ type, label }: MemberBadgeProps) {
  const isStreak = type === 'streak';

  return (
    <Tag
      variant='info'
      state={isStreak ? 'good' : 'bad'}
      className='md:text-small-02-m text-small-03-r h-4.25 rounded px-1.5 py-0 leading-none md:h-6.75 md:rounded-lg md:px-3 md:py-1'
    >
      <StateIcon variant={isStreak ? 'active' : 'warning'} className='h-3 w-3 md:h-4 md:w-4' />
      <span className='translate-y-px'>{label}</span>
    </Tag>
  );
}
