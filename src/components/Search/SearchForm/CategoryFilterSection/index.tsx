'use client';

import { useMemo } from 'react';
import { useQueries, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { gatheringKeys, gatheringQueries } from '@/api/gatherings/queries';
import { ErrorFallback } from '@/components/ErrorFallback';
import { SuspenseBoundary } from '@/components/SuspenseBoundary';
import { CategoryIcon } from '@/components/ui/Icon/CategoryIcon';

import { CategoryMultiSelect } from '../CategoryMultiSelect';
import { CategoryDropdownSkeleton } from './Skeleton';

interface CategoryFilterSectionProps {
  selectedValues: number[];
  onChange: (values: number[]) => void;
}

function CategoryMultiSelectContainer({ selectedValues, onChange }: CategoryFilterSectionProps) {
  const { data } = useSuspenseQuery(gatheringQueries.categories());

  const categoryCountQueries = useQueries({
    queries: data.categories.map((c) => gatheringQueries.list({ categoryIds: [c.id], limit: 1 })),
  });

  const categoryItems = useMemo(
    () =>
      data.categories.map((c, i) => ({
        label: c.name,
        value: c.id,
        count: categoryCountQueries[i].data?.totalCount,
      })),
    [data, categoryCountQueries],
  );

  return (
    <CategoryMultiSelect
      icon={<CategoryIcon size={20} className='shrink-0 text-gray-800 md:size-7' />}
      placeholder='카테고리를 선택해주세요'
      selectedValues={selectedValues}
      items={categoryItems}
      onChange={onChange}
    />
  );
}

export function CategoryFilterSection({ selectedValues, onChange }: CategoryFilterSectionProps) {
  const queryClient = useQueryClient();

  const handleReset = () => {
    // 캐시에 남아 있는 실패 상태를 초기화해 ErrorBoundary 리셋과 함께 카테고리 쿼리를 다시 페칭한다.
    queryClient.resetQueries({ queryKey: gatheringKeys.categories() });
  };

  return (
    <SuspenseBoundary
      onReset={handleReset}
      pendingFallback={<CategoryDropdownSkeleton />}
      errorFallback={(_, reset) => <ErrorFallback message='카테고리를 불러올 수 없습니다.' onRetry={reset} />}
    >
      <CategoryMultiSelectContainer selectedValues={selectedValues} onChange={onChange} />
    </SuspenseBoundary>
  );
}
