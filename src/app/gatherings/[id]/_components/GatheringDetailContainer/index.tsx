import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { gatheringQueries } from '@/api/gatherings/queries';
import { getQueryClient } from '@/lib/getQueryClient';

import { AnchorTabNav } from '../AnchorTabNav';
import { FloatingActionBar } from '../ApplySection/FloatingActionBar';
import { GatheringHero } from '../GatheringHero';
import { GatheringDetailContent } from '../GatheringDetailContent';
import { GatheringInfoAside } from '../ApplySection/GatheringInfoAside';
import { GatheringInfoCard } from '../ApplySection/GatheringInfoCard';

interface GatheringDetailContainerProps {
  gatheringId: number;
}

export async function GatheringDetailContainer({ gatheringId }: GatheringDetailContainerProps) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(gatheringQueries.detail(gatheringId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GatheringHero gatheringId={gatheringId} />

      <div className='px-4 pt-6 md:px-8 xl:hidden'>
        <GatheringInfoCard gatheringId={gatheringId} />
      </div>

      <AnchorTabNav gatheringId={gatheringId} />

      <div className='px-4 pt-10 md:px-7 xl:flex xl:gap-20 xl:px-30'>
        <section className='min-w-0 flex-1'>
          <GatheringDetailContent gatheringId={gatheringId} />
        </section>

        <aside className='hidden xl:block xl:w-[560px] xl:shrink-0'>
          <GatheringInfoAside gatheringId={gatheringId} />
        </aside>
      </div>

      <FloatingActionBar gatheringId={gatheringId} />
    </HydrationBoundary>
  );
}
