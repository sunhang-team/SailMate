'use client';

import { useRouter } from 'next/navigation';

import { PersonIcon, ReviewIcon } from '@/components/ui/Icon';

interface ReviewWriteButtonProps {
  gatheringId: number;
  reviewedCount: number;
  totalCount: number;
}

export function ReviewWriteButton({ gatheringId, reviewedCount, totalCount }: ReviewWriteButtonProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/gatherings/${gatheringId}/dashboard?tab=members`);
  };

  return (
    <button
      type='button'
      onClick={handleClick}
      className='relative flex h-[54px] w-full cursor-pointer items-center justify-center rounded-[8px] bg-blue-300 md:h-[72px]'
    >
      <div className='flex items-center gap-2'>
        <ReviewIcon size={16} className='text-white md:size-6' />
        <span className='text-small-01-sb md:text-body-01-sb text-white'>리뷰 쓰기</span>
      </div>
      <div className='bg-gray-0 absolute right-3 flex h-[25px] w-[59px] items-center justify-center gap-1 rounded-[8px] md:right-5 md:h-[32px] md:w-[71px]'>
        <PersonIcon size={10} className='text-blue-300 md:size-5' />
        <span className='text-small-02-sb md:text-body-02-sb text-blue-300'>
          {reviewedCount}/{totalCount}
        </span>
      </div>
    </button>
  );
}
