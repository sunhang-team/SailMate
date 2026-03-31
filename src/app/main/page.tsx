import { getQueryClient } from '@/lib/getQueryClient';
import { DeadlineGatheringSection } from './components/DeadlineGatheringSection';
import { HeroSection } from './components/HeroSection';
import { LatestGatheringSection } from './components/LatestGatheringSection';
import { MyGatheringSection } from './components/MyGatheringSection';
import { PopularGatheringSection } from './components/PopularGatheringSection';
import { gatheringQueries } from '@/api/gatherings/queries';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { MAX_GATHERING_LIMIT } from './constant/constant';

export const revalidate = 3600;

export default async function MainPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(gatheringQueries.main({ limit: MAX_GATHERING_LIMIT }));

  return (
    <>
      <HeroSection />
      <div className='mx-auto flex w-full max-w-[1920px] flex-col gap-15 px-4 py-10 md:gap-26 md:px-7 md:py-20 lg:gap-30 lg:px-12 lg:py-24 xl:px-20 2xl:px-30'>
        <MyGatheringSection />
        <HydrationBoundary state={dehydrate(queryClient)}>
          <PopularGatheringSection />
          <DeadlineGatheringSection />
          <LatestGatheringSection />
        </HydrationBoundary>
      </div>
    </>
  );
}
