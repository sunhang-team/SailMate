'use client';

import Link from 'next/link';

import { EmptyState } from '@/components/EmptyState';
import { MainGatheringCard } from '@/components/MainGatheringCard';
import { Pagination } from '@/components/ui/Pagination';

import { usePopularGatherings } from './usePopularGatherings';

export function PopularGatheringList() {
  const { page, setPage, totalPages, visibleGatherings } = usePopularGatherings();
  const isEmpty = visibleGatherings.length === 0;

  return (
    <div>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-body-01-b md:text-h4-b lg:text-h3-b text-gray-900'>인기 모임🔥</h2>
        {!isEmpty && (
          <div className='flex items-center gap-3 md:gap-6'>
            <Link
              href='/gatherings?sort=popular'
              className='text-small-02-m md:text-small-01-m lg:text-body-02-m text-gray-600'
            >
              더보기
            </Link>
            <Pagination variant='simple' currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>
      {isEmpty ? (
        <EmptyState
          emoji='🔥'
          title='아직 모이고 있는 모임이 없어요'
          description='혼자 마무리하기 어려운 일, 완성도와 끝까지 가봐요'
          action={{ label: '모임 만들기', href: '/gatherings/new' }}
        />
      ) : (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6'>
          {visibleGatherings.map((gathering) => (
            <MainGatheringCard
              key={gathering.id}
              gathering={gathering}
              href={`/gatherings/${gathering.id}?source=recommendation`}
              joinButtonLabel='참여하기'
              joinButtonClassName=''
              isJoinDisabled={false}
              initialFavorite={false}
              className=''
            />
          ))}
        </div>
      )}
    </div>
  );
}
