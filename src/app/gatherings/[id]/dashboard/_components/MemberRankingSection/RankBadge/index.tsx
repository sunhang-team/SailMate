import { RatingIcon } from '@/components/ui/Icon';

interface RankBadgeProps {
  rank: number;
}

const MEDAL_VARIANTS = {
  1: 'gold',
  2: 'silver',
  3: 'bronze',
} as const;

export function RankBadge({ rank }: RankBadgeProps) {
  if (rank <= 3) {
    return (
      <div className='flex w-8 items-center justify-center'>
        <RatingIcon variant={MEDAL_VARIANTS[rank as keyof typeof MEDAL_VARIANTS]} size={28} />
      </div>
    );
  }

  return <div className='text-body-02-sb flex w-8 items-center justify-center text-gray-600'>{rank}</div>;
}
