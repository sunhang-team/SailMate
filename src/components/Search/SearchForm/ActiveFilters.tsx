'use client';

import { startTransition } from 'react';

import { ReplayIcon } from '@/components/ui/Icon/ReplayIcon';
import { Tag } from '@/components/ui/Tag';
import { DEFAULT_CATEGORIES } from '@/constants/gathering';
import { useGatheringSearchParams } from '@/hooks/useGatheringSearchParams';

export function ActiveFilters() {
  const { query, type, categoryIds, setParams } = useGatheringSearchParams();

  const hasActiveFilters = query !== '' || type !== null || categoryIds.length > 0;
  if (!hasActiveFilters) return null;

  const handleRemoveQuery = () => {
    startTransition(() => {
      setParams({ query: '', page: 1 }, { history: 'push' });
    });
  };

  const handleRemoveType = () => {
    startTransition(() => {
      setParams({ type: null, page: 1 }, { history: 'push' });
    });
  };

  const handleRemoveCategory = (id: number) => {
    startTransition(() => {
      setParams({ categoryIds: categoryIds.filter((v) => v !== id), page: 1 }, { history: 'push' });
    });
  };

  const handleResetFilters = () => {
    startTransition(() => {
      setParams({ query: '', type: null, categoryIds: [], page: 1 }, { history: 'push' });
    });
  };

  return (
    <div className='flex flex-wrap items-center gap-2'>
      {query && (
        <Tag variant='filter' onRemove={handleRemoveQuery}>
          검색어 &gt; {query}
        </Tag>
      )}
      {type && (
        <Tag variant='filter' onRemove={handleRemoveType}>
          {type}
        </Tag>
      )}
      {categoryIds.map((id) => (
        <Tag key={id} variant='filter' onRemove={() => handleRemoveCategory(id)}>
          {DEFAULT_CATEGORIES.find((c) => c.id === id)?.name ?? id}
        </Tag>
      ))}
      <button
        type='button'
        onClick={handleResetFilters}
        className='text-small-02-r flex items-center gap-[2px] text-blue-500'
      >
        선택 초기화
        <ReplayIcon size={16} />
      </button>
    </div>
  );
}
