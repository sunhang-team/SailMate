import { useState, useTransition } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';

import { userQueries } from '@/api/users/queries';
import { reviewQueries } from '@/api/reviews/queries';

const FIXED_LIMIT_REVIEW = 2;

export const useMemberDetail = (memberId: number) => {
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const handlePageChange = (newPage: number) => {
    startTransition(() => {
      setPage(newPage);
    });
  };

  const { data: userProfile } = useSuspenseQuery(userQueries.userId(memberId));
  const { data: reviewsData } = useSuspenseQuery({
    ...reviewQueries.list(memberId, { page }),
  });

  const totalPages = Math.ceil((reviewsData?.totalCount || 0) / FIXED_LIMIT_REVIEW) || 1;
  const allTags = userProfile?.reviews?.flatMap((review) => review.tags || []) || [];
  const tagCounts = allTags.reduce(
    (acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  const aggregatedTags = Object.entries(tagCounts)
    .map(([text, count]) => ({ text, count }))
    .sort((a, b) => b.count - a.count);

  return {
    page,
    setPage: handlePageChange,
    userProfile,
    reviewsData,
    totalPages,
    aggregatedTags,
    isPending,
  };
};
