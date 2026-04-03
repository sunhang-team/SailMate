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
      <div className='flex w-[18px] items-center justify-center md:w-[30px]'>
        <RatingIcon
          variant={MEDAL_VARIANTS[rank as keyof typeof MEDAL_VARIANTS]}
          className='h-[24px] w-[18px] md:h-[40px] md:w-[30px]'
        />
      </div>
    );
  }

  return (
    <div className='text-small-02-sb md:text-body-02-sb flex w-[18px] items-center justify-center text-gray-600 md:w-[30px]'>
      {rank}
    </div>
  );
}
