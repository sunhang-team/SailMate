'use client';

import { startTransition, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { CategoryIcon } from '@/components/ui/Icon/CategoryIcon';
import { TypeIcon } from '@/components/ui/Icon/TypeIcon';
import { DEFAULT_CATEGORIES, GATHERING_TYPES } from '@/constants/gathering';
import { useGatheringSearchParams } from '@/hooks/useGatheringSearchParams';

import { ActiveFilters } from './ActiveFilters';
import { CategoryMultiSelect } from './CategoryMultiSelect';
import { FilterDropdown } from './FilterDropdown';
import { SearchInput } from './SearchInput';

const TYPE_ITEMS = [{ label: '전체', value: null }, ...GATHERING_TYPES.map((t) => ({ label: t, value: t }))] as const;
const CATEGORY_ITEMS = DEFAULT_CATEGORIES.map((c) => ({ label: c.name, value: c.id }));

export function SearchForm() {
  const { type, categoryIds, query, setParams } = useGatheringSearchParams();
  const [inputValue, setInputValue] = useState('');
  const hasActiveFilter = !!type || categoryIds.length > 0 || !!query;
  const searchVariant = hasActiveFilter ? 'search-gradient' : 'search';

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
    startTransition(() => {
      setParams({ type: value as (typeof GATHERING_TYPES)[number] | null, page: 1 }, { history: 'push' });
    });
  };

  const handleCategoryChange = (values: number[]) => {
    startTransition(() => {
      setParams({ categoryIds: values, page: 1 }, { history: 'push' });
    });
  };

  return (
    <div className='flex w-full flex-col gap-6'>
      <div className='border-gradient-primary relative flex flex-col rounded-lg bg-white xl:flex-row'>
        <SearchInput value={inputValue} onChange={setInputValue} onKeyDown={handleKeyDown} />

        <div className='mx-5 border-t border-gray-200 md:mx-7 xl:mx-0 xl:my-2 xl:border-t-0 xl:border-l' />

        <div className='flex flex-col md:flex-row xl:flex-2'>
          <FilterDropdown
            icon={<TypeIcon size={20} className='shrink-0 text-gray-800 md:size-7' />}
            placeholder='모임 유형을 선택해주세요'
            selectedValue={type}
            items={TYPE_ITEMS}
            onSelect={handleTypeSelect}
          />

          <div className='mx-5 border-t border-gray-200 md:mx-0 md:my-2 md:border-t-0 md:border-l' />

          <CategoryMultiSelect
            icon={<CategoryIcon size={20} className='shrink-0 text-gray-800 md:size-7' />}
            placeholder='카테고리를 선택해주세요'
            selectedValues={categoryIds}
            items={CATEGORY_ITEMS}
            onChange={handleCategoryChange}
          />
        </div>

        <Button variant={searchVariant} size='search' onClick={handleSearch} className='relative z-1 hidden xl:block'>
          검색
        </Button>
      </div>

      <ActiveFilters />

      <Button
        variant={searchVariant}
        onClick={handleSearch}
        className='text-body-02-sb md:text-body-01-sb h-[58px] w-full rounded-lg md:h-18 xl:hidden'
      >
        검색
      </Button>
    </div>
  );
}
