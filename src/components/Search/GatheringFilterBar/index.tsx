'use client';

import { useGatheringSearchParams } from '@/hooks/useGatheringSearchParams';

import { SortFilter } from './SortFilter';
import { StatusFilter } from './StatusFilter';

interface GatheringFilterBarProps {
  totalCount: number;
}

export function GatheringFilterBar({ totalCount }: GatheringFilterBarProps) {
  const { sort, status, setParams } = useGatheringSearchParams();

  const handleSortChange = (value: string) => {
    setParams({ sort: value as 'latest' | 'popular' | 'deadline', page: 1 }, { history: 'push' });
  };

  const handleStatusChange = (value: string) => {
    setParams({ status: value as 'RECRUITING' | 'ALL', page: 1 }, { history: 'push' });
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center gap-4'>
        <h2 className='text-body-01-b md:text-h3-b text-gray-900'>모임정보</h2>
        <span className='text-small-02-r md:text-body-01-r text-gray-500'>총 {totalCount}건</span>
      </div>
      <div className='flex items-center justify-between'>
        <SortFilter value={sort} onChange={handleSortChange} />
        <StatusFilter value={status} onChange={handleStatusChange} />
      </div>
    </div>
  );
}
