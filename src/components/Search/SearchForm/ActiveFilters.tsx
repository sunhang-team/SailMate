'use client';

import { ReplayIcon } from '@/components/ui/Icon/ReplayIcon';
import { Tag } from '@/components/ui/Tag';
import { useGatheringSearchParams } from '@/hooks/useGatheringSearchParams';

export function ActiveFilters() {
  const { query, type, category, setParams } = useGatheringSearchParams();

  const hasActiveFilters = query !== '' || type !== null || category !== null;
  if (!hasActiveFilters) return null;

  const handleRemoveQuery = () => {
    setParams({ query: '', page: 1 }, { history: 'push' });
  };

  const handleRemoveType = () => {
    setParams({ type: null, page: 1 }, { history: 'push' });
  };

  const handleRemoveCategory = () => {
    setParams({ category: null, page: 1 }, { history: 'push' });
  };

  const handleResetFilters = () => {
    setParams({ query: '', type: null, category: null, page: 1 }, { history: 'push' });
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
      {category && (
        <Tag variant='filter' onRemove={handleRemoveCategory}>
          {category}
        </Tag>
      )}
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
