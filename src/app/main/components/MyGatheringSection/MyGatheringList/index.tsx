'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { MembershipGathering } from '@/api/memberships/types';
import { EmptyState } from '@/components/EmptyState';
import { Pagination } from '@/components/ui/Pagination';

import { MyGatheringCard } from '../MyGatheringCard';
import { useMyGatheringList } from './useMyGatheringList';

export function MyGatheringList() {
  const router = useRouter();
  const { page, setPage, totalPages, visibleGatherings, memberQueries } = useMyGatheringList();
  const isEmpty = visibleGatherings.length === 0;

  const handleCardClick = (id: number) => {
    router.push(`/gatherings/${id}/dashboard`);
  };

  return (
    <div>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-body-01-b md:text-h4-b lg:text-h3-b text-gray-900'>내 모임💡</h2>
        {!isEmpty && (
          <div className='flex items-center gap-3 md:gap-6'>
            <Link href='/gatherings' className='text-body-02-b text-gray-500'>
              더보기
            </Link>
            <Pagination variant='simple' currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>
      {isEmpty ? (
        <EmptyState
          emoji='💡'
          title='아직 참여 중인 모임이 없어요'
          description='관심 있는 분야의 모임을 찾아, 동료와 함께 완성해 봐요'
          action={{ label: '모임 탐색하기', href: '/gatherings' }}
        />
      ) : (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6'>
          {visibleGatherings.map((gathering: MembershipGathering, index) => (
            <MyGatheringCard
              key={gathering.id}
              gathering={gathering}
              members={memberQueries[index].data.members}
              onClick={() => handleCardClick(gathering.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
