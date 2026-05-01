'use client';

import { useRouter } from 'next/navigation';

import { ReviewIcon } from '@/components/ui/Icon';

interface ReviewWriteButtonProps {
  gatheringId: number;
}

export function ReviewWriteButton({ gatheringId }: ReviewWriteButtonProps) {
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
      className='flex h-[54px] w-full cursor-pointer items-center justify-center rounded-[8px] bg-blue-50 md:h-[72px]'
    >
      <div className='flex items-center gap-2'>
        <ReviewIcon size={16} className='text-blue-300 md:size-6' />
        <span className='text-small-01-sb md:text-body-01-sb text-blue-300'>리뷰 쓰기</span>
      </div>
    </button>
  );
}
