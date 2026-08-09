'use client';

import { useMemo } from 'react';

import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { gatheringKeys, gatheringQueries } from '@/api/gatherings/queries';
import { ErrorFallback } from '@/components/ErrorFallback';
import { SuspenseBoundary } from '@/components/SuspenseBoundary';
import { GATHERING_TYPES } from '@/constants/gathering';
import { cn } from '@/lib/cn';
import { Dropdown } from '@/components/ui/Dropdown';
import { useDropdown } from '@/components/ui/Dropdown/context';
import { ArrowIcon, SearchIcon } from '@/components/ui/Icon';

import type { ReactNode } from 'react';
import type { GatheringType } from '@/api/gatherings/types';

export const RECOMMENDED_KEYWORDS = ['코딩', '디자인', '피그마', '앱 기획', 'AI'] as const;

const ALL_TYPE_LABEL = '모임유형 전체';
const ALL_CATEGORY_LABEL = '카테고리 전체';

function HeroSearchFormSkeleton() {
  return (
    <div className='flex w-full flex-col gap-2 min-[744px]:gap-4'>
      <div className='flex w-full gap-2 min-[744px]:gap-4'>
        <div className='h-[54px] flex-1 animate-pulse rounded-xl bg-gray-100 min-[744px]:h-18 min-[744px]:rounded-2xl' />
        <div className='h-[54px] w-[54px] shrink-0 animate-pulse rounded-xl bg-gray-100 min-[744px]:h-18 min-[744px]:w-18' />
      </div>
      <div className='flex flex-col gap-2 min-[744px]:gap-4 xl:w-[calc(100%_-_88px)] xl:flex-row xl:items-center xl:justify-between xl:self-start'>
        <div className='h-5 w-full max-w-2xl animate-pulse rounded-md bg-gray-100 min-[744px]:h-9' />
        <div className='h-5 w-48 animate-pulse rounded-md bg-gray-100 min-[744px]:h-8' />
      </div>
    </div>
  );
}

interface HeroSearchFormBoundaryProps {
  children: ReactNode;
}

export function HeroSearchFormBoundary({ children }: HeroSearchFormBoundaryProps) {
  const queryClient = useQueryClient();

  const handleReset = () => {
    queryClient.resetQueries({ queryKey: gatheringKeys.categories() });
  };

  return (
    <SuspenseBoundary
      onReset={handleReset}
      pendingFallback={<HeroSearchFormSkeleton />}
      errorFallback={(_, reset) => <ErrorFallback message='검색 폼을 불러올 수 없습니다.' onRetry={reset} />}
    >
      {children}
    </SuspenseBoundary>
  );
}

interface FilterArrowProps {
  className?: string;
}

function FilterArrow({ className }: FilterArrowProps) {
  const { isOpen } = useDropdown();

  return (
    <ArrowIcon
      size={16}
      className={cn(
        'shrink-0 rotate-90 text-gray-800 transition-transform duration-200',
        className,
        isOpen && 'rotate-270',
      )}
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
        <div className='text-small-02-sb min-[744px]:text-body-01-sb flex cursor-pointer items-center gap-1 text-gray-800 min-[744px]:gap-2'>
          <span>{selectedLabel}</span>
          <FilterArrow className='size-4 min-[744px]:size-6' />
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
  const { data: categoriesData } = useSuspenseQuery(gatheringQueries.categories());

  const categoryItems = useMemo(
    () => categoriesData.categories.map((category) => ({ label: category.name, value: category.id })),
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
    <div className='flex w-full flex-col gap-2 min-[744px]:gap-4'>
      <form onSubmit={handleSubmit} className='flex w-full gap-2 min-[744px]:gap-4'>
        <div className='border-gradient-primary bg-gray-0 flex h-[54px] min-w-0 flex-1 items-center rounded-xl px-[21px] min-[744px]:h-18 min-[744px]:rounded-2xl min-[744px]:px-7'>
          <input
            type='text'
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder='모임명 또는 키워드를 검색하세요'
            className='text-small-01-r min-[744px]:text-body-01-r h-full w-full min-w-0 outline-none placeholder:text-gray-600'
          />
        </div>
        <button
          type='submit'
          aria-label='모임 검색'
          className='flex h-[54px] w-[54px] shrink-0 cursor-pointer items-center justify-center rounded-xl bg-blue-300 text-white transition-colors hover:bg-blue-400 min-[744px]:h-18 min-[744px]:w-18'
        >
          <SearchIcon className='size-6 min-[744px]:size-8' />
        </button>
      </form>

      <div className='flex flex-col gap-2 min-[744px]:gap-4 xl:w-[calc(100%_-_88px)] xl:flex-row xl:items-center xl:justify-between xl:self-start'>
        <div className='flex flex-wrap items-center gap-1.5 min-[744px]:gap-2'>
          <span className='min-[744px]:text-body-02-sb text-[8px] leading-[160%] font-semibold text-gray-700 min-[744px]:mr-3'>
            추천 검색어
          </span>
          {RECOMMENDED_KEYWORDS.map((keyword) => (
            <button
              key={keyword}
              type='button'
              onClick={() => handleKeywordClick(keyword)}
              className='min-[744px]:text-body-02-m cursor-pointer rounded-md bg-gray-50 px-3 py-1 text-[8px] leading-[160%] font-medium text-gray-700 transition-colors hover:bg-blue-100 hover:text-blue-400 min-[744px]:rounded-lg min-[744px]:px-4'
            >
              {keyword}
            </button>
          ))}
        </div>

        <div className='flex items-center justify-start gap-5 xl:gap-7'>
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
