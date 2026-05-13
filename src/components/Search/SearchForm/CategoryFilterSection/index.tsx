'use client';

import { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { gatheringKeys, gatheringQueries } from '@/api/gatherings/queries';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ErrorFallback } from '@/components/ErrorFallback';
import { CategoryIcon } from '@/components/ui/Icon/CategoryIcon';

import { CategoryMultiSelect } from '../CategoryMultiSelect';

interface CategoryFilterSectionProps {
  selectedValues: number[];
  onChange: (values: number[]) => void;
}

function CategoryMultiSelectContainer({ selectedValues, onChange }: CategoryFilterSectionProps) {
  const { data, error } = useQuery(gatheringQueries.categories());

  const categoryItems = useMemo(() => data?.categories.map((c) => ({ label: c.name, value: c.id })) ?? [], [data]);

  if (error) throw error;
  if (!data) throw new Error('카테고리 목록을 불러올 수 없습니다.');

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
    <ErrorBoundary
      onReset={handleReset}
      fallback={(_, reset) => <ErrorFallback message='카테고리를 불러올 수 없습니다.' onRetry={reset} />}
    >
      <CategoryMultiSelectContainer selectedValues={selectedValues} onChange={onChange} />
    </ErrorBoundary>
  );
}
