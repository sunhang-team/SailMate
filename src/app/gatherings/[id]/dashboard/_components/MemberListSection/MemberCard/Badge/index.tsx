import { StateIcon } from '@/components/ui/Icon';
import { Tag } from '@/components/ui/Tag';

interface MemberBadgeProps {
  type: 'streak' | 'warning';
  label: string;
}

export function MemberBadge({ type, label }: MemberBadgeProps) {
  const isStreak = type === 'streak';

  return (
    <Tag variant='info' state={isStreak ? 'good' : 'bad'}>
      <StateIcon variant={isStreak ? 'warning' : 'active'} size={14} />
      {label}
    </Tag>
  );
}

export function MeBadge() {
  return (
    <span className='text-small-02-sb md:text-body-02-sb inline-flex size-8 items-center justify-center rounded-full border border-blue-300 text-blue-300 md:size-10'>
      나
    </span>
  );
}
