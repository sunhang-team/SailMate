'use client';

import { startTransition } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

import { MainGatheringCard } from '@/components/MainGatheringCard';
import { GatheringFilterBar } from '@/components/Search/GatheringFilterBar';
import { Pagination } from '@/components/ui/Pagination';
import { gatheringQueries } from '@/api/gatherings/queries';
import { useGatheringSearchParams } from '@/hooks/useGatheringSearchParams';

const PAGE_LIMIT = 12;

export function GatheringList() {
  const { query, type, category, sort, status, page, setParams } = useGatheringSearchParams();

  const { data } = useSuspenseQuery(
    gatheringQueries.list({
      ...(query && { query }),
      ...(type && { type }),
      ...(category && { category }),
      sort,
      status,
      page,
      limit: PAGE_LIMIT,
    }),
  );

  const handlePageChange = (newPage: number) => {
    startTransition(() => {
      setParams({ page: newPage }, { history: 'push' });
    });
  };

  if (data.gatherings.length === 0) {
    return (
      <>
        <GatheringFilterBar totalCount={0} />
        <p className='text-body-02-r py-20 text-center text-gray-500'>검색 결과가 없습니다.</p>
      </>
    );
  }

  return (
    <>
      <GatheringFilterBar totalCount={data.totalCount} />
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {data.gatherings.map((gathering) => (
          <MainGatheringCard key={gathering.id} gathering={gathering} initialFavorite={gathering.isLiked} />
        ))}
      </div>
      {data.totalPages > 1 && (
        <Pagination
          variant='numbered'
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
}
