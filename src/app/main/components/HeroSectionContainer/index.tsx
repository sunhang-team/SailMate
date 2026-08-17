import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { gatheringQueries } from '@/api/gatherings/queries';
import { getQueryClient } from '@/lib/getQueryClient';
import { isMswEnabled } from '@/lib/msw';

import { HeroSection } from '../HeroSection';

export async function HeroSectionContainer() {
  const queryClient = getQueryClient();

  if (!isMswEnabled) {
    await queryClient.prefetchQuery(gatheringQueries.categories());
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HeroSection />
    </HydrationBoundary>
  );
}
