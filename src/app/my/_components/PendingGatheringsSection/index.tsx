'use client';

import Link from 'next/link';
import { useMemo } from 'react';

import { useQueries, useSuspenseQuery } from '@tanstack/react-query';

import { applicationQueries } from '@/api/applications/queries';
import { gatheringQueries } from '@/api/gatherings/queries';
import { CheckIcon } from '@/components/ui/Icon/CheckIcon';
import { cn } from '@/lib/cn';

import { PendingGatheringCard } from './PendingGatheringCard';

import type { MyApplication } from '@/api/applications/types';

import type { PendingGatheringSort } from '../../_constants';

interface PendingGatheringsSectionProps {
  pendingSort: PendingGatheringSort;
}

const sortPendingApplications = (applications: MyApplication[], sort: PendingGatheringSort): MyApplication[] => {
  const next = [...applications];
  next.sort((a, b) => {
    const ta = new Date(a.createdAt).getTime();
    const tb = new Date(b.createdAt).getTime();
    return sort === 'latest' ? tb - ta : ta - tb;
  });
  return next;
};

const PendingGatheringRowSkeleton = () => (
  <div className='bg-gray-0 border-gray-150 h-72 w-full animate-pulse rounded-lg border' aria-hidden />
);

const PendingGatheringRowError = ({ message }: { message: string }) => (
  <div
    className='border-gray-150 text-small-01-r flex min-h-24 items-center justify-center rounded-lg border bg-white px-4 py-6 text-gray-600'
    role='status'
  >
    {message}
  </div>
);

export function PendingGatheringsSection({ pendingSort }: PendingGatheringsSectionProps) {
  const { data: myList } = useSuspenseQuery(applicationQueries.myList());

  const pendingApplications = useMemo(
    () => myList.applications.filter((a) => a?.status === 'PENDING' && typeof a?.gathering?.id === 'number'),
    [myList.applications],
  );

  const totalCount = pendingApplications.length;

  const sortedApplications = useMemo(
    () => sortPendingApplications(pendingApplications, pendingSort),
    [pendingApplications, pendingSort],
  );

  const uniqueGatheringIds = useMemo(
    () => [...new Set(pendingApplications.map((a) => a.gathering.id))],
    [pendingApplications],
  );

  const detailQueries = useQueries({
    queries: uniqueGatheringIds.map((id) => ({
      ...gatheringQueries.detail(id),
    })),
  });

  const gatheringIdToQueryIndex = useMemo(() => {
    const map = new Map<number, number>();
    uniqueGatheringIds.forEach((id, index) => {
      map.set(id, index);
    });
    return map;
  }, [uniqueGatheringIds]);

  const sortHref = (sort: PendingGatheringSort) => `/my?tab=pending-gatherings&pendingSort=${sort}`;

  return (
    <div className='mt-10 flex flex-col'>
      <div className='mb-12 flex flex-col'>
        <div className='mb-4 flex items-center gap-4'>
          <h2 className='text-h3-b text-gray-900'>대기중</h2>
          <span className='text-body-01-r text-gray-500'>총 {totalCount}건</span>
        </div>

        <div className='flex items-center gap-4'>
          <Link
            href={sortHref('latest')}
            replace
            scroll={false}
            className={cn(
              'text-body-02-r flex items-center text-gray-500',
              pendingSort === 'latest' && 'text-body-02-r text-gray-800',
            )}
          >
            <CheckIcon size={24} className={cn(!(pendingSort === 'latest') && 'hidden')} />
            최신순
          </Link>
          <span className='text-body-02-r text-gray-500'>|</span>
          <Link
            href={sortHref('oldest')}
            replace
            scroll={false}
            className={cn(
              'text-body-02-r flex items-center text-gray-500',
              pendingSort === 'oldest' && 'text-body-02-r text-gray-800',
            )}
          >
            <CheckIcon size={24} className={cn(!(pendingSort === 'oldest') && 'hidden')} />
            과거순
          </Link>
        </div>
      </div>

      {sortedApplications.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-2 py-12 text-center'>
          <p className='text-body-01-m text-gray-800'>대기 중인 모임이 없습니다</p>
          <p className='text-body-02-r text-gray-500'>모임에 참여 신청하면 이곳에 표시됩니다.</p>
        </div>
      ) : (
        <ul className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          {sortedApplications.map((application) => {
            const qIndex = gatheringIdToQueryIndex.get(application.gathering.id);
            const query = qIndex !== undefined ? detailQueries[qIndex] : undefined;

            return (
              <li key={application.id}>
                {!query || query.isPending ? (
                  <PendingGatheringRowSkeleton />
                ) : query.isError ? (
                  <PendingGatheringRowError message='모임 정보를 불러오지 못했습니다.' />
                ) : query.data ? (
                  <PendingGatheringCard application={application} gathering={query.data} />
                ) : (
                  <PendingGatheringRowError message='모임 정보를 불러오지 못했습니다.' />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
