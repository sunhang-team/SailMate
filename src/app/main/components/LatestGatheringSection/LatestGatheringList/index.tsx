'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { MainGatheringCard } from '@/components/MainGatheringCard';
import { Pagination } from '@/components/ui/Pagination';

import { useLatestGatherings } from './useLatestGatherings';

export function LatestGatheringList() {
  const router = useRouter();
  const { page, setPage, totalPages, visibleGatherings } = useLatestGatherings();

  const handleJoin = (id: number) => {
    router.push(`/gatherings/${id}`);
  };

  return (
    <div>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-body-01-b md:text-h4-b lg:text-h3-b text-gray-900'>최신 모임</h2>
        <div className='flex items-center gap-3 md:gap-6'>
          <Link href='/gatherings' className='text-body-02-b text-gray-500'>
            더보기
          </Link>
          <Pagination variant='simple' currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
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
    </div>
  );
}
