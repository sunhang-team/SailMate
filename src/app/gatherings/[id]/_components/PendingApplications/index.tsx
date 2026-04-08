'use client';

import { useMemo, useState } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

import { applicationQueries } from '@/api/applications/queries';
import { Pagination } from '@/components/ui/Pagination';

import { ApplicationCard } from './ApplicationCard';

const ITEMS_PER_PAGE = 5;

interface PendingApplicationsProps {
  gatheringId: number;
}

export function PendingApplications({ gatheringId }: PendingApplicationsProps) {
  const { data } = useSuspenseQuery(applicationQueries.list(gatheringId));
  const [page, setPage] = useState(1);

  const pendingApplications = useMemo(
    () => data.applications.filter((app) => app.status === 'PENDING'),
    [data.applications],
  );

  const totalCount = pendingApplications.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = pendingApplications.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (totalCount === 0) {
    return (
      <div className='rounded-lg border border-gray-200 bg-gray-50 px-4 py-6'>
        <p className='text-body-02-r text-gray-500'>아직 신청자가 없습니다</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      {/* 헤더 */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <h2 className='text-body-01-sb lg:text-h5-sb text-gray-900'>신청 대기자</h2>
          <span className='text-body-01-sb lg:text-h5-sb text-blue-300'>{totalCount}</span>
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className='flex items-center gap-6'>
            <span className='text-small-02-m text-gray-500'>
              {currentPage}/{totalPages}
            </span>
            <Pagination
              variant='simple'
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* 카드 목록 */}
      <div className='flex flex-col gap-2 md:gap-4'>
        {currentItems.map((application) => (
          <ApplicationCard key={application.id} gatheringId={gatheringId} application={application} />
        ))}
      </div>
    </div>
  );
}
