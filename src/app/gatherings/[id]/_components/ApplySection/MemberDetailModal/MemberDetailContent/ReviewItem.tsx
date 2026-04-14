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
    <li className='border-gray-150 flex flex-col gap-2 rounded-xl border bg-gray-100 p-4 shadow-sm md:gap-4 md:p-6'>
      <div className='flex items-start gap-2'>
        <div className='relative h-6 w-6 shrink-0 overflow-hidden rounded-lg bg-gray-200 md:h-12 md:w-12'>
          <Image
            src={imgSrc}
            alt={`${review.reviewer?.nickname || '익명'} 프로필`}
            fill
            className='object-cover'
            onError={onError}
          />
        </div>
        <div className='flex flex-1 justify-between'>
          <div className='flex flex-col text-left'>
            <span className='md:text-body-02-sb text-[13px] font-bold text-gray-800'>
              {review.reviewer?.nickname || '익명'}
            </span>
            <span className='text-small-01-r text-gray-400'>{review.gatheringTitle}</span>
          </div>
          <span className='md:text-small-01-r text-[8px] text-gray-400'>{formatReviewDate(review.createdAt)}</span>
        </div>
      </div>
      <div className='border-gray-150 border-t' />
      <p className='text-small-02-r md:text-body-02-r text-gray-700'>{review.comment}</p>
    </li>
  );
}
