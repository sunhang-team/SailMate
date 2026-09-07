'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { HeroSearchForm, HeroSearchFormBoundary } from '@/components/Search/HeroSearchForm';

import type { GatheringType } from '@/api/gatherings/types';

export function MainHeroSearchForm() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [type, setType] = useState<GatheringType | null>(null);
  const [categoryIds, setCategoryIds] = useState<number[]>([]);

  const moveToGatherings = (nextQuery = query) => {
    const params = new URLSearchParams();
    const trimmed = nextQuery.trim();

    if (trimmed) params.set('query', trimmed);
    if (type) params.set('type', type);
    if (categoryIds.length > 0) params.set('categoryIds', categoryIds.join(','));

    const search = params.toString();
    router.push(search ? `/gatherings?${search}` : '/gatherings');
  };

  return (
    <HeroSearchFormBoundary>
      <HeroSearchForm
        query={query}
        type={type}
        categoryIds={categoryIds}
        onQueryChange={setQuery}
        onTypeChange={setType}
        onCategoryIdsChange={setCategoryIds}
        onSearch={moveToGatherings}
      />
    </HeroSearchFormBoundary>
  );
}
