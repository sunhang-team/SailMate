'use client';

import { useState, useTransition } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

import { cn } from '@/lib/cn';
import { Dropdown } from '@/components/ui/Dropdown';
import { useDropdown } from '@/components/ui/Dropdown/context';
import { ArrowIcon } from '@/components/ui/Icon/ArrowIcon';
import { CheckIcon } from '@/components/ui/Icon/CheckIcon';
import { Pagination } from '@/components/ui/Pagination';
import { membershipQueries } from '@/api/memberships/queries';
import { useMediaQuery } from '@/hooks/useMediaQuery';

import { MyGatheringsCard } from '../MyGatheringsCard';

import type { GatheringStatusFilter } from '@/api/memberships/types';

type SortOrder = 'latest' | 'oldest';
type MyStatusFilter = Extract<GatheringStatusFilter, 'all' | 'in_progress' | 'completed'>;

const SORT_OPTIONS: { label: string; value: SortOrder }[] = [
  { label: '최신순', value: 'latest' },
  { label: '과거순', value: 'oldest' },
];

const STATUS_OPTIONS: { label: string; value: MyStatusFilter }[] = [
  { label: '전체', value: 'all' },
  { label: '진행중', value: 'in_progress' },
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

export function MyGatheringsList() {
  const isLg = useMediaQuery('(min-width: 1024px)');
  const limit = isLg ? 6 : 5;

  const [status, setStatus] = useState<MyStatusFilter>('all');
  const [sort, setSort] = useState<SortOrder>('latest');
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  // status=all: API가 RECRUITING 포함 반환 → 서버 totalPages 신뢰 불가
  // → 전체를 한 번에 받아(limit=999) 클라이언트에서 필터/페이지네이션
  // status=in_progress|completed: 서버 필터 정확 → 서버 페이지네이션 그대로 사용
  const isAll = status === 'all';
  const { data } = useSuspenseQuery(
    membershipQueries.my({ status, page: isAll ? 1 : page, limit: isAll ? 999 : limit }),
  );

  const filtered = isAll ? data.gatherings.filter((g) => g.status !== 'RECRUITING') : data.gatherings;
  const sorted = [...filtered].sort((a, b) => {
    const diff = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    return sort === 'latest' ? -diff : diff;
  });
  const totalPages = isAll ? Math.max(1, Math.ceil(sorted.length / limit)) : data.totalPages;
  const paged = isAll ? sorted.slice((page - 1) * limit, page * limit) : sorted;

  const handleFilterChange = (next: Partial<{ status: MyStatusFilter; sort: SortOrder }>) => {
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
    <div className='mt-6 flex flex-col gap-6'>
      <div className='flex items-center justify-between'>
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
                    isSelected ? 'font-semibold text-gray-800' : 'text-gray-500',
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
          <Dropdown.Menu className='flex flex-col gap-2 overflow-hidden p-2 whitespace-nowrap'>
            {STATUS_OPTIONS.map((option) => {
              const isSelected = status === option.value;
              return (
                <Dropdown.Item
                  key={option.value}
                  onClick={() => handleFilterChange({ status: option.value })}
                  className={cn(
                    'cursor-pointer rounded-lg px-4 py-2 hover:bg-blue-100 hover:text-blue-400',
                    isSelected && 'bg-blue-100 text-blue-400',
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
          <p className='text-body-02-r text-gray-400'>참여한 모임이 없습니다.</p>
        </div>
      ) : (
        <div className={cn('grid grid-cols-1 gap-4 lg:grid-cols-2', isPending && 'opacity-50')}>
          {paged.map((gathering) => (
            <MyGatheringsCard key={gathering.id} gathering={gathering} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          variant='numbered'
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => startTransition(() => setPage(p))}
        />
      )}
    </div>
  );
}
