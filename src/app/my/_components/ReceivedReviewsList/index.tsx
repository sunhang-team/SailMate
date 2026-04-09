'use client';

import { useState, useTransition } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

import { reviewQueries } from '@/api/reviews/queries';
import { useAuth } from '@/hooks/useAuth';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Pagination } from '@/components/ui/Pagination';

import { ActivityEnergyCard } from '../ActivityEnergyCard';
import { KeywordSummaryCard } from '../KeywordSummaryCard';
import { ReceivedReviewCard } from '../ReceivedReviewCard';

import type { Review } from '@/api/reviews/types';

export function ReceivedReviewsList() {
  const { user } = useAuth();
  if (!user) return null;
  return <ReceivedReviewsContent userId={user.id} />;
}

interface ReceivedReviewsContentProps {
  userId: number;
}

interface ReviewsGridProps {
  paged: Review[];
}

function ReviewsGrid({ paged }: ReviewsGridProps) {
  if (paged.length === 0) {
    return (
      <div className='flex h-40 items-center justify-center'>
        <p className='text-small-02-r md:text-body-02-r text-gray-400'>받은 리뷰가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
      {paged.map((review) => (
        <ReceivedReviewCard key={review.id} review={review} profileImage={review.reviewer.profileImage} />
      ))}
    </div>
  );
}

const PAGE_SIZE_DEFAULT = 3;
const PAGE_SIZE_LG = 6;

function ReceivedReviewsContent({ userId }: ReceivedReviewsContentProps) {
  const isLg = useMediaQuery('(min-width: 1024px)');
  const pageSize = isLg ? PAGE_SIZE_LG : PAGE_SIZE_DEFAULT;
  const [page, setPage] = useState(1);
  const [, startTransition] = useTransition();

  const { data } = useSuspenseQuery(reviewQueries.list(userId));
  const { reviews, matesTagCounts } = data;

  // 받은 리뷰 섹션에는 comment가 있는 리뷰만 표시되므로, comment가 있는 리뷰를 따로 구분
  const reviewsWithComment = reviews.filter((r) => !!r.comment);

  const paged = reviewsWithComment.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(reviewsWithComment.length / pageSize));

  return (
    <div className='mt-6 flex flex-col gap-6'>
      <ActivityEnergyCard matesTagCounts={matesTagCounts} />
      <KeywordSummaryCard reviews={reviews} />
      <div className='border-gray-150 bg-gray-0 shadow-02 flex flex-col gap-4 rounded-lg border p-6'>
        <div className='flex items-center gap-2'>
          <span className='text-body-02-sb md:text-h5-sb text-gray-900'>받은 리뷰</span>
          <span className='text-body-02-sb md:text-h5-sb text-gray-600'>{reviewsWithComment.length}</span>
        </div>
        <ReviewsGrid paged={paged} />
      </div>
      {totalPages > 1 && (
        <Pagination
          variant='numbered'
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => startTransition(() => setPage(p))}
        />
      )}
    </div>
  );
}
