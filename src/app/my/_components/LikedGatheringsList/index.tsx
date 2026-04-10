'use client';

import { useEffect, useState, useTransition } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

import { likeQueries, useRemoveLike } from '@/api/likes/queries';
import { Dropdown } from '@/components/ui/Dropdown';
import { useDropdown } from '@/components/ui/Dropdown/context';
import { ArrowIcon } from '@/components/ui/Icon/ArrowIcon';
import { CheckIcon } from '@/components/ui/Icon/CheckIcon';
import { Pagination } from '@/components/ui/Pagination';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/cn';
import { getGatheringDisplayStatus } from '@/lib/gatheringStatus';

import { LikedGatheringCard } from '../LikedGatheringCard';

import type { GatheringListItem } from '@/api/gatherings/types';

type SortOrder = 'latest' | 'oldest';

type LikedDisplayStatusFilter = 'all' | 'recruiting' | 'progressing' | 'completed';

const SORT_OPTIONS: { label: string; value: SortOrder }[] = [
  { label: '최신순', value: 'latest' },
  { label: '과거순', value: 'oldest' },
];

const STATUS_OPTIONS: { label: string; value: LikedDisplayStatusFilter }[] = [
  { label: '전체', value: 'all' },
  { label: '모집중', value: 'recruiting' },
  { label: '진행중', value: 'progressing' },
  { label: '진행완료', value: 'completed' },
];

function RotatingArrow() {
  const { isOpen } = useDropdown();
  return (
    <ArrowIcon
      size={16}
      className={cn(
        'shrink-0 rotate-90 text-gray-800 transition-transform duration-200 md:size-5',
        isOpen && 'rotate-270',
      )}
    />
  );
}

const matchesStatusFilter = (gathering: GatheringListItem, status: LikedDisplayStatusFilter) => {
  if (status === 'all') return true;
  const display = getGatheringDisplayStatus({
    status: gathering.status,
    currentMembers: gathering.currentMembers,
    maxMembers: gathering.maxMembers,
    startDate: gathering.startDate,
    endDate: gathering.endDate,
    recruitDeadline: gathering.recruitDeadline,
  });
  return display.tagState === status;
};

export function LikedGatheringsList() {
  const isLg = useMediaQuery('(min-width: 1024px)');
  const limit = isLg ? 6 : 5;

  const [status, setStatus] = useState<LikedDisplayStatusFilter>('all');
  const [sort, setSort] = useState<SortOrder>('latest');
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const { data } = useSuspenseQuery(likeQueries.myFull());

  const removeLikeMutation = useRemoveLike();

  const filtered = data.gatherings.filter((g) => matchesStatusFilter(g, status));
  const sorted = [...filtered].sort((a, b) => {
    const diff = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    return sort === 'latest' ? -diff : diff;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / limit));
  const displayPage = Math.min(page, totalPages);
  const paged = sorted.slice((displayPage - 1) * limit, displayPage * limit);

  useEffect(() => {
    if (page > totalPages) {
      startTransition(() => setPage(totalPages));
    }
  }, [page, totalPages, startTransition]);

  const handleFilterChange = (next: Partial<{ status: LikedDisplayStatusFilter; sort: SortOrder }>) => {
    if (next.sort !== undefined) {
      setSort(next.sort);
      return;
    }
    startTransition(() => {
      if (next.status !== undefined) setStatus(next.status);
      setPage(1);
    });
  };

  const selectedStatusLabel = STATUS_OPTIONS.find((o) => o.value === status)?.label ?? '전체';

  return (
    <div className='mt-8 flex flex-col md:mt-10'>
      <div className='mb-4 flex items-center gap-4'>
        <span className='text-body-01-b md:text-h3-b text-gray-900'>{selectedStatusLabel}</span>
        <span className='text-small-02-r md:text-body-01-r text-gray-500'>총 {sorted.length}건</span>
      </div>
      <div className='mb-10 flex items-center justify-between md:mb-12 lg:mb-10'>
        <div className='flex items-center gap-2 md:gap-4'>
          {SORT_OPTIONS.map((option, index) => {
            const isSelected = sort === option.value;
            return (
              <div key={option.value} className='flex items-center gap-2 md:gap-4'>
                {index > 0 && <span className='text-small-02-r md:text-body-02-r text-gray-500'>|</span>}
                <button
                  type='button'
                  onClick={() => handleFilterChange({ sort: option.value })}
                  className={cn(
                    'text-small-02-r md:text-body-02-r flex cursor-pointer items-center gap-0.5',
                    isSelected ? 'text-small-02-sb md:text-body-02-sb text-gray-800' : 'text-gray-500',
                  )}
                >
                  <CheckIcon size={16} className={cn('md:size-6', !isSelected && 'hidden')} />
                  {option.label}
                </button>
              </div>
            );
          })}
        </div>

        <Dropdown className='**:[[role=listbox]]:right-0'>
          <Dropdown.Trigger>
            <div className='flex items-center gap-2'>
              <span className='text-small-02-m md:text-body-02-m text-gray-800'>{selectedStatusLabel}</span>
              <RotatingArrow />
            </div>
          </Dropdown.Trigger>
          <Dropdown.Menu className='flex flex-col gap-3 overflow-hidden px-3 py-2 whitespace-nowrap'>
            {STATUS_OPTIONS.map((option) => {
              const isSelected = status === option.value;
              return (
                <Dropdown.Item
                  key={option.value}
                  onClick={() => handleFilterChange({ status: option.value })}
                  className={cn(
                    'text-small-02-m md:text-body-02-r cursor-pointer rounded-lg px-4 py-2 text-gray-500 hover:bg-blue-100 hover:text-blue-400',
                    isSelected && 'text-small-02-m md:text-body-02-m bg-blue-100 text-gray-900',
                  )}
                >
                  {option.label}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {paged.length === 0 ? (
        <div className='flex h-40 items-center justify-center'>
          <p className='text-body-02-r text-gray-400'>찜한 모임이 없습니다.</p>
        </div>
      ) : (
        <div className={cn('grid grid-cols-1 gap-4 xl:grid-cols-2', isPending && 'opacity-50')}>
          {paged.map((gathering) => (
            <LikedGatheringCard
              key={gathering.id}
              gathering={gathering}
              onUnlike={() => removeLikeMutation.mutate(gathering.id)}
              isUnlikePending={removeLikeMutation.isPending && removeLikeMutation.variables === gathering.id}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          variant='numbered'
          currentPage={displayPage}
          totalPages={totalPages}
          onPageChange={(p) => startTransition(() => setPage(p))}
          className='mt-15 mb-30 md:mt-20 md:mb-40 lg:mb-41.5'
        />
      )}
    </div>
  );
}
