'use client';

import { startTransition, useState } from 'react';

import { HeroSearchForm } from '@/components/Search/HeroSearchForm';
import { useGatheringSearchParams } from '@/hooks/useGatheringSearchParams';

import type { GatheringType } from '@/api/gatherings/types';

interface SearchFormContentProps {
  initialQuery: string;
}

function SearchFormContent({ initialQuery }: SearchFormContentProps) {
  const { type, categoryIds, setParams } = useGatheringSearchParams();
  const [inputValue, setInputValue] = useState(initialQuery);

  const handleSearch = (nextQuery: string) => {
    startTransition(() => {
      setParams({ query: nextQuery.trim(), page: 1 }, { history: 'push' });
    });
  };

  const handleTypeChange = (nextType: GatheringType | null) => {
    startTransition(() => {
      setParams({ type: nextType, page: 1 }, { history: 'push' });
    });
  };

  const handleCategoryIdsChange = (nextCategoryIds: number[]) => {
    startTransition(() => {
      setParams({ categoryIds: nextCategoryIds, page: 1 }, { history: 'push' });
    });
  };

  return (
    <HeroSearchForm
      query={inputValue}
      type={type}
      categoryIds={categoryIds}
      onQueryChange={setInputValue}
      onTypeChange={handleTypeChange}
      onCategoryIdsChange={handleCategoryIdsChange}
      onSearch={handleSearch}
    />
  );
}

export function SearchForm() {
  const { query } = useGatheringSearchParams();

  return <SearchFormContent key={query} initialQuery={query} />;
}
