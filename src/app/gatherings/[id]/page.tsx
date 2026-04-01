import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { getQueryClient } from '@/lib/getQueryClient';
import { gatheringQueries } from '@/api/gatherings/queries';

import { AnchorTabNav } from './_components/AnchorTabNav';
import { GatheringDetailContent } from './_components/GatheringDetailContent';
import { GatheringHero } from './_components/GatheringHero';

interface GatheringDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function GatheringDetailPage({ params }: GatheringDetailPageProps) {
  const { id } = await params;
  const gatheringId = Number(id);

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(gatheringQueries.detail(gatheringId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className='mb-20 min-h-screen'>
        <ErrorBoundary
          fallback={<p className='py-20 text-center text-gray-500'>모임 정보를 불러오는데 실패했습니다.</p>}
        >
          <GatheringHero gatheringId={gatheringId} />

          {/* TODO: [이슈 2] Mobile/Tablet 사이드바 정보 카드 (xl:hidden) */}

          <AnchorTabNav />

          <div className='px-4 pt-10 md:px-7 xl:flex xl:gap-20 xl:px-30'>
            <section className='min-w-0 flex-1'>
              <GatheringDetailContent gatheringId={gatheringId} />
            </section>

            <aside className='xl:block xl:w-[560px] xl:shrink-0'>
              {/* TODO: [이슈 2] Desktop 사이드바 (sticky) */}
            </aside>
          </div>
        </ErrorBoundary>
      </main>
    </HydrationBoundary>
  );
}
