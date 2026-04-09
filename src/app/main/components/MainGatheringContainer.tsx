import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { gatheringQueries } from '@/api/gatherings/queries';
import { getQueryClient } from '@/lib/getQueryClient';

import { DeadlineGatheringSection } from './DeadlineGatheringSection';
import { LatestGatheringSection } from './LatestGatheringSection';
import { PopularGatheringSection } from './PopularGatheringSection';
import { MAX_GATHERING_LIMIT } from '../constant/constant';

export async function MainGatheringContainer() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(gatheringQueries.main({ limit: MAX_GATHERING_LIMIT }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className='flex flex-col gap-15 md:gap-26 lg:gap-30'>
        <PopularGatheringSection />
        <DeadlineGatheringSection />
        <LatestGatheringSection />
      </div>
    </HydrationBoundary>
  );
}
