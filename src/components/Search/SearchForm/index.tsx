'use client';

import { startTransition, useMemo, useState } from 'react';

import { useQueries } from '@tanstack/react-query';

import { Button } from '@/components/ui/Button';
import { TypeIcon } from '@/components/ui/Icon/TypeIcon';
import { GATHERING_TYPES } from '@/constants/gathering';
import { GATHERING_TYPE_TO_PARAM } from '@/api/gatherings/types';
import { gatheringQueries } from '@/api/gatherings/queries';
import { useGatheringSearchParams } from '@/hooks/useGatheringSearchParams';

import { ActiveFilters } from './ActiveFilters';
import { CategoryFilterSection } from './CategoryFilterSection';
import { FilterDropdown } from './FilterDropdown';
import { SearchInput } from './SearchInput';

const ALL_TYPE_VALUE = 'ALL';

export function SearchForm() {
  const { type, categoryIds, query, setParams } = useGatheringSearchParams();
  const [inputValue, setInputValue] = useState('');
  const hasActiveFilter = !!type || categoryIds.length > 0 || !!query;
  const searchVariant = hasActiveFilter ? 'search-gradient' : 'search';

  const typeCountQueries = useQueries({
    queries: GATHERING_TYPES.map((t) => gatheringQueries.list({ type: GATHERING_TYPE_TO_PARAM[t], limit: 1 })),
  });

  const typeItems = useMemo(
    () => [
      { label: '전체', value: ALL_TYPE_VALUE },
      ...GATHERING_TYPES.map((t, i) => ({
        label: t,
        value: t,
        count: typeCountQueries[i].data?.totalCount,
      })),
    ],
    [typeCountQueries],
  );

  const handleSearch = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      startTransition(() => {
        setParams({ query: trimmed, page: 1 }, { history: 'push' });
      });
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      handleSearch();
    }
  };

  const handleTypeSelect = (value: string | null) => {
    const resolved = value === ALL_TYPE_VALUE ? null : value;
    startTransition(() => {
      setParams({ type: resolved as (typeof GATHERING_TYPES)[number] | null, page: 1 }, { history: 'push' });
    });
  };

  const handleCategoryChange = (values: number[]) => {
    startTransition(() => {
      setParams({ categoryIds: values, page: 1 }, { history: 'push' });
    });
  };

  return (
    <div className='relative flex w-full flex-col'>
      <div className='border-gradient-primary relative flex flex-col rounded-lg bg-white xl:flex-row'>
        <SearchInput value={inputValue} onChange={setInputValue} onKeyDown={handleKeyDown} />

        <div className='mx-5 border-t border-gray-200 md:mx-7 xl:mx-0 xl:my-2 xl:border-t-0 xl:border-l' />

        <div className='flex flex-col md:flex-row xl:flex-2'>
          <FilterDropdown
            icon={<TypeIcon size={20} className='shrink-0 text-gray-800 md:size-7' />}
            placeholder='모임 유형을 선택해주세요'
            selectedValue={type}
            items={typeItems}
            onSelect={handleTypeSelect}
          />

          <div className='mx-5 border-t border-gray-200 md:mx-0 md:my-2 md:border-t-0 md:border-l' />

          <CategoryFilterSection selectedValues={categoryIds} onChange={handleCategoryChange} />
        </div>

        <Button variant={searchVariant} size='search' onClick={handleSearch} className='relative z-1 hidden xl:block'>
          검색
        </Button>
      </div>

      <div className='absolute top-full left-0 w-full pt-2'>
        <ActiveFilters />
      </div>

      <Button
        variant={searchVariant}
        onClick={handleSearch}
        className='text-body-02-sb md:text-body-01-sb mt-[78px] h-[58px] w-full rounded-lg md:mt-6 md:h-18 xl:hidden'
      >
        검색
      </Button>
    </div>
  );
}
