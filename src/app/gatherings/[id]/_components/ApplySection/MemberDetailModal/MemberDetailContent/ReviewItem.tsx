'use client';

import Image from 'next/image';

import { useFallbackImage } from '@/hooks/useFallbackImage';

import { formatReviewDate } from '../../utils/dateUtils';

import type { Review } from '@/api/reviews/types';

interface ReviewItemProps {
  review: Review;
  profileImg?: string;
}

export function ReviewItem({ review, profileImg }: ReviewItemProps) {
  const { imgSrc, onError } = useFallbackImage(profileImg);

  return (
    <li className='border-gray-150 flex min-h-[118px] flex-col gap-2 rounded-lg border bg-gray-100 p-4 min-[744px]:min-h-[151px] min-[744px]:gap-4 min-[744px]:px-7 min-[744px]:py-6'>
      <div className='flex items-start gap-2'>
        <div className='relative size-6 shrink-0 overflow-hidden rounded bg-gray-200 min-[744px]:size-[45px] min-[744px]:rounded-lg'>
          <Image
            src={imgSrc}
            alt={`${review.reviewer?.nickname || '익명'} 프로필`}
            fill
            className='object-cover'
            onError={onError}
          />
        </div>
        <div className='flex flex-1 justify-between'>
          <div className='flex min-w-0 flex-col text-left'>
            <span className='text-small-02-sb min-[744px]:text-body-02-sb truncate text-gray-800'>
              {review.reviewer?.nickname || '익명'}
            </span>
            <span className='min-[744px]:text-small-02-r text-[8px] leading-[160%] font-normal break-keep text-gray-400'>
              {review.gatheringTitle}
            </span>
          </div>
          <span className='min-[744px]:text-small-01-r text-[8px] text-gray-400'>
            {formatReviewDate(review.createdAt)}
          </span>
        </div>
      </div>
      <div className='border-gray-150 border-t' />
      <p className='text-small-02-r min-[744px]:text-body-02-r text-gray-700'>{review.comment}</p>
    </li>
  );
}
