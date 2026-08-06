'use client';

import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { gatheringQueries } from '@/api/gatherings/queries';
import { GATHERING_TYPES } from '@/constants/gathering';
import { cn } from '@/lib/cn';
import { Dropdown } from '@/components/ui/Dropdown';
import { useDropdown } from '@/components/ui/Dropdown/context';
import { ArrowIcon, SearchIcon } from '@/components/ui/Icon';

import type { GatheringType } from '@/api/gatherings/types';

export const RECOMMENDED_KEYWORDS = ['코딩', '디자인', '피그마', '앱 기획', 'AI'] as const;

const ALL_TYPE_LABEL = '모임유형 전체';
const ALL_CATEGORY_LABEL = '카테고리 전체';

function FilterArrow() {
  const { isOpen } = useDropdown();

  return (
    <ArrowIcon
      size={16}
      className={cn('shrink-0 rotate-90 text-gray-800 transition-transform duration-200', isOpen && 'rotate-270')}
    />
  );
}

interface HeroFilterDropdownProps<T extends string | number> {
  label: string;
  selectedLabel: string;
  items: readonly { label: string; value: T | null }[];
  onSelect: (value: T | null) => void;
  isSelected?: (item: { label: string; value: T | null }) => boolean;
  closeOnSelect?: boolean;
}

function HeroFilterDropdown<T extends string | number>({
  label,
  selectedLabel,
  items,
  onSelect,
  isSelected = (item) => selectedLabel === item.label,
  closeOnSelect = true,
}: HeroFilterDropdownProps<T>) {
  return (
    <Dropdown className='**:[[role=listbox]]:right-0 **:[[role=listbox]]:w-40'>
      <Dropdown.Trigger>
        <div className='text-body-02-sb md:text-body-01-sb flex items-center gap-2 text-gray-800'>
          <span>{selectedLabel}</span>
          <FilterArrow />
        </div>
      </Dropdown.Trigger>
      <Dropdown.Menu className='flex flex-col gap-1 p-2' containerClassName='right-0'>
        <Dropdown.Item
          onClick={() => onSelect(null)}
          className={cn(
            'text-small-01-r cursor-pointer rounded-lg px-4 py-3 hover:bg-blue-100 hover:text-blue-400',
            selectedLabel === label && 'text-small-01-sb bg-blue-100 text-blue-300',
          )}
        >
          {label}
        </Dropdown.Item>
        {items.map((item) => {
          const selected = isSelected(item);
          return (
            <Dropdown.Item
              key={`${item.value}`}
              onClick={() => onSelect(item.value)}
              closeOnSelect={closeOnSelect}
              className={cn(
                'text-small-01-r cursor-pointer rounded-lg px-4 py-3 hover:bg-blue-100 hover:text-blue-400',
                selected && 'text-small-01-sb bg-blue-100 text-blue-300',
              )}
            >
              {item.label}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}

interface HeroSearchFormProps {
  query: string;
  type: GatheringType | null;
  categoryIds: number[];
  onQueryChange: (query: string) => void;
  onTypeChange: (type: GatheringType | null) => void;
  onCategoryIdsChange: (categoryIds: number[]) => void;
  onSearch: (query: string) => void;
}

export function HeroSearchForm({
  query,
  type,
  categoryIds,
  onQueryChange,
  onTypeChange,
  onCategoryIdsChange,
  onSearch,
}: HeroSearchFormProps) {
  const { data: categoriesData } = useQuery(gatheringQueries.categories());

  const categoryItems = useMemo(
    () => categoriesData?.categories.map((category) => ({ label: category.name, value: category.id })) ?? [],
    [categoriesData],
  );

  const selectedCategoryLabels = categoryIds
    .map((categoryId) => categoryItems.find((item) => item.value === categoryId)?.label)
    .filter((label): label is string => !!label);
  const categoryLabel =
    selectedCategoryLabels.length === 0
      ? ALL_CATEGORY_LABEL
      : `${selectedCategoryLabels[0]}${selectedCategoryLabels.length > 1 ? ` 외 ${selectedCategoryLabels.length - 1}` : ''}`;

  const handleCategorySelect = (nextCategoryId: number | null) => {
    if (nextCategoryId === null) {
      onCategoryIdsChange([]);
      return;
    }

    onCategoryIdsChange(
      categoryIds.includes(nextCategoryId)
        ? categoryIds.filter((categoryId) => categoryId !== nextCategoryId)
        : [...categoryIds, nextCategoryId],
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleKeywordClick = (keyword: string) => {
    onQueryChange(keyword);
    onSearch(keyword);
  };

  return (
    <div className='flex w-full flex-col gap-5'>
      <form onSubmit={handleSubmit} className='flex w-full gap-4'>
        <div className='border-gradient-primary bg-gray-0 flex h-14 flex-1 items-center gap-3 rounded-lg px-5 md:h-18 md:px-7'>
          <input
            type='text'
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder='모임명 또는 키워드를 검색하세요'
            className='text-body-02-r md:text-body-01-r h-full w-full outline-none placeholder:text-gray-400'
          />
        </div>
        <button
          type='submit'
          aria-label='모임 검색'
          className='flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-blue-300 text-white transition-colors hover:bg-blue-400 md:h-18 md:w-18'
        >
          <SearchIcon className='h-6 w-6 md:h-8 md:w-8' />
        </button>
      </form>

      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div className='flex flex-wrap items-center gap-2 md:gap-3'>
          <span className='text-small-01-sb md:text-body-02-sb mr-2 text-gray-600'>추천 검색어</span>
          {RECOMMENDED_KEYWORDS.map((keyword) => (
            <button
              key={keyword}
              type='button'
              onClick={() => handleKeywordClick(keyword)}
              className='text-small-01-r md:text-body-02-r bg-gray-0 rounded-md px-4 py-2 text-gray-700 transition-colors hover:bg-blue-100 hover:text-blue-400'
            >
              {keyword}
            </button>
          ))}
        </div>

        <div className='flex items-center justify-end gap-8 md:gap-12'>
          <HeroFilterDropdown<GatheringType>
            label={ALL_TYPE_LABEL}
            selectedLabel={type ?? ALL_TYPE_LABEL}
            items={GATHERING_TYPES.map((gatheringType) => ({ label: gatheringType, value: gatheringType }))}
            onSelect={onTypeChange}
          />
          <HeroFilterDropdown<number>
            label={ALL_CATEGORY_LABEL}
            selectedLabel={categoryLabel}
            items={categoryItems}
            onSelect={handleCategorySelect}
            isSelected={(item) => item.value !== null && categoryIds.includes(item.value)}
            closeOnSelect={false}
          />
        </div>
      </div>
    </div>
  );
}
