import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { gatheringQueries } from '@/api/gatherings/queries';
import { getQueryClient } from '@/lib/getQueryClient';

import { HeroSection } from '../HeroSection';

export async function HeroSectionContainer() {
  const queryClient = getQueryClient();
  const isMswDev = process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_MSW_ENABLED === 'true';

  if (!isMswDev) {
    await queryClient.prefetchQuery(gatheringQueries.categories());
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HeroSection />
    </HydrationBoundary>
  );
}
