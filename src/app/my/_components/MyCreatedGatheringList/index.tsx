'use client';

import { useState, useTransition } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';

import { membershipQueries } from '@/api/memberships/queries';
import { Dropdown } from '@/components/ui/Dropdown';
import { useDropdown } from '@/components/ui/Dropdown/context';
import { ArrowIcon } from '@/components/ui/Icon/ArrowIcon';
import { CheckIcon } from '@/components/ui/Icon/CheckIcon';
import { Pagination } from '@/components/ui/Pagination';
import { cn } from '@/lib/cn';
import { useMediaQuery } from '@/hooks/useMediaQuery';

import { MyCreatedGatheringCard } from '../MyCreatedGatheringCard';

import type { GatheringStatusFilter } from '@/api/memberships/types';

type SortOrder = 'latest' | 'oldest';

const SORT_OPTIONS: { label: string; value: SortOrder }[] = [
  { label: '최신순', value: 'latest' },
  { label: '과거순', value: 'oldest' },
];

const STATUS_OPTIONS: { label: string; value: GatheringStatusFilter }[] = [
  { label: '전체', value: 'all' },
  { label: '모집중', value: 'recruiting' },
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

export function MyCreatedGatheringList() {
  const isXl = useMediaQuery('(min-width: 1280px)');
  const limit = isXl ? 6 : 4;

  const [status, setStatus] = useState<GatheringStatusFilter>('all');
  const [sort, setSort] = useState<SortOrder>('latest');
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  // "내 모임"과 달리 "만든 모임"은 모든 상태를 보여주므로 특별한 클라이언트 필터링 없이 서버 응답을 신뢰
  // 단, getMyGatherings API가 참여/생성 구분 없이 가져오므로 프론트엔드에서 LEADER 필터링이 필요함
  // (임시 조치이므로 limit=999로 가져와 처리)
  // TODO: 서비스 오픈 후 성능 모니터링 필요
  // - 백엔드 API에 role 파라미터 지원 요청 (GET /users/me/gatherings?role=LEADER)
  // - 또는 별도 엔드포인트 추가 고려 (GET /users/me/created-gatherings)
  const { data } = useSuspenseQuery({
    ...membershipQueries.my({ status, page: 1, limit: 999 }),
  });

  // LEADER인 것만 필터링
  const myCreated = data.gatherings.filter((g) => g.myRole === 'LEADER');

  // 정렬
  const sorted = [...myCreated].sort((a, b) => {
    const diff = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    return sort === 'latest' ? -diff : diff;
  });

  // 페이지네이션
  const totalPages = Math.max(1, Math.ceil(sorted.length / limit));
  const paged = sorted.slice((page - 1) * limit, page * limit);

  const handleFilterChange = (next: Partial<{ status: GatheringStatusFilter; sort: SortOrder }>) => {
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
      <div className='mb-10 flex flex-col md:mb-12'>
        <div className='mb-5.5 flex items-center gap-4 md:mb-4'>
          <h2 className='text-body-01-b md:text-h3-b text-gray-900'>{selectedStatusLabel}</h2>
          <span className='text-small-02-r md:text-body-01-r text-gray-500'>총 {sorted.length}건</span>
        </div>

        <div className='flex items-center justify-between gap-4'>
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
              <div className='flex cursor-pointer items-center gap-2'>
                <span className='text-small-02-m md:text-body-02-m text-gray-800'>{selectedStatusLabel}</span>
                <RotatingArrow />
              </div>
            </Dropdown.Trigger>
            <Dropdown.Menu className='flex min-w-[100px] flex-col gap-2 overflow-hidden p-2 whitespace-nowrap'>
              {STATUS_OPTIONS.map((option) => {
                const isSelected = status === option.value;
                return (
                  <Dropdown.Item
                    key={option.value}
                    onClick={() => handleFilterChange({ status: option.value })}
                    className={cn(
                      'text-small-02-m md:text-body-02-r cursor-pointer rounded-lg px-4 py-2 text-gray-500 hover:bg-blue-100 hover:text-blue-400',
                      isSelected && 'text-body-02-m bg-blue-100 text-gray-900',
                    )}
                  >
                    {option.label}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {paged.length === 0 ? (
        <div className='flex h-40 items-center justify-center'>
          <p className='text-body-02-r text-gray-400'>만든 모임이 없습니다.</p>
        </div>
      ) : (
        <div className={cn('grid grid-cols-1 gap-4 xl:grid-cols-2', isPending && 'opacity-50')}>
          {paged.map((gathering) => (
            <MyCreatedGatheringCard key={gathering.id} gathering={gathering} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          variant='numbered'
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => startTransition(() => setPage(p))}
          className='mt-12'
        />
      )}
    </div>
  );
}
