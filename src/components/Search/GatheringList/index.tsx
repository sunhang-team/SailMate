'use client';

import { startTransition, useEffect, useRef } from 'react';

import { useRouter } from 'next/navigation';

import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

import { MainGatheringCard } from '@/components/MainGatheringCard';
import { GatheringFilterBar } from '@/components/Search/GatheringFilterBar';
import { Pagination } from '@/components/ui/Pagination';
import { gatheringQueries } from '@/api/gatherings/queries';
import { GATHERING_TYPE_TO_PARAM } from '@/api/gatherings/types';
import { useGatheringSearchParams } from '@/hooks/useGatheringSearchParams';
import { trackGatheringSearch } from '@/lib/analytics/gathering';

const PAGE_LIMIT = 12;

export function GatheringList() {
  const router = useRouter();
  const { query, type, categoryIds, sort, status, page, setParams } = useGatheringSearchParams();

  const { data } = useSuspenseQuery(
    gatheringQueries.list({
      ...(query && { query }),
      ...(type && { type: GATHERING_TYPE_TO_PARAM[type] }),
      ...(categoryIds.length > 0 && { categoryIds }),
      sort,
      status,
      page,
      limit: PAGE_LIMIT,
    }),
  );

  // 카테고리 데이터는 page.tsx 에서 prefetched. cache hit 으로 비용 없음.
  // GA 이벤트에 categoryIds → 이름 매핑 용도로만 사용.
  const { data: categoriesData } = useQuery(gatheringQueries.categories());

  const handlePageChange = (newPage: number) => {
    startTransition(() => {
      setParams({ page: newPage }, { history: 'push' });
    });
  };

  const handleJoin = (id: number) => {
    router.push(`/gatherings/${id}?source=search`);
  };

  // query / category 조합이 변경되어 새 결과가 도착할 때 1회 search 이벤트 발사.
  // 페이지네이션·정렬 변경은 새 "검색"이 아니므로 signature 에서 제외.
  const lastSearchedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!query) return;
    // 카테고리 필터가 적용된 검색인데 카테고리 데이터가 아직 도착 안 했다면 대기.
    // 필터 없는 검색은 매핑 자체가 불필요하므로 곧장 발사.
    if (categoryIds.length > 0 && !categoriesData) return;

    const signature = `${query}|${categoryIds.join(',')}`;
    if (lastSearchedRef.current === signature) return;
    lastSearchedRef.current = signature;

    const categoryNames = categoryIds
      .map((id) => categoriesData?.categories.find((c) => c.id === id)?.name)
      .filter((name): name is string => !!name);
    const category = categoryNames.length ? categoryNames.join(',') : undefined;

    trackGatheringSearch({ query, category, resultCount: data.totalCount });
  }, [query, categoryIds, data.totalCount, categoriesData]);

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
          <MainGatheringCard key={gathering.id} gathering={gathering} onJoin={() => handleJoin(gathering.id)} />
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
