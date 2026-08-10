'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { EmptyState } from '@/components/EmptyState';
import { GatheringSectionSkeleton } from '@/app/main/components/GatheringSectionSkeleton';
import { MainGatheringCard } from '@/components/MainGatheringCard';
import { Pagination } from '@/components/ui/Pagination';

import { useDeadlineGatherings } from './useDeadlineGatherings';

export function DeadlineGatheringList() {
  const router = useRouter();
  const { page, setPage, totalPages, visibleGatherings, isPending } = useDeadlineGatherings();
  const isEmpty = visibleGatherings.length === 0;

  const handleJoin = (id: number) => {
    router.push(`/gatherings/${id}?source=recommendation`);
  };

  if (isPending) {
    return <GatheringSectionSkeleton />;
  }

  return (
    <div>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-body-01-b md:text-h4-b lg:text-h3-b text-gray-900'>마감 임박 모임⏰</h2>
        {!isEmpty && (
          <div className='flex items-center gap-3 md:gap-6'>
            <Link
              href='/gatherings?sort=deadline'
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
          emoji='⏰'
          title='마감 임박 모임이 없어요'
          description='마감까지 같이 갈 동료, 직접 모아 보세요'
          action={{ label: '모임 만들기', href: '/gatherings/new' }}
        />
      ) : (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6'>
          {visibleGatherings.map((gathering) => (
            <MainGatheringCard
              key={gathering.id}
              gathering={gathering}
              joinButtonLabel='참여하기'
              joinButtonClassName=''
              isJoinDisabled={false}
              initialFavorite={false}
              onJoin={() => handleJoin(gathering.id)}
              className=''
            />
          ))}
        </div>
      )}
    </div>
  );
}
