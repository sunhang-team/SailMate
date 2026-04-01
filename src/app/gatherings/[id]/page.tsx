import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { getQueryClient } from '@/lib/getQueryClient';
import { gatheringQueries } from '@/api/gatherings/queries';

import { AnchorTabNav } from './_components/AnchorTabNav';
import { GatheringDetailContent } from './_components/GatheringDetailContent';
import { FloatingActionBar } from './_components/ApplySection/FloatingActionBar';
import { GatheringHero } from './_components/GatheringHero';
import { GatheringInfoAside } from './_components/ApplySection/GatheringInfoAside';
import { GatheringInfoCard } from './_components/ApplySection/GatheringInfoCard';

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
      <main className='min-h-screen pb-20 xl:pb-0'>
        <ErrorBoundary
          fallback={<p className='py-20 text-center text-gray-500'>모임 정보를 불러오는데 실패했습니다.</p>}
        >
          <GatheringHero gatheringId={gatheringId} />

          {/* TODO: [이슈 2] Mobile/Tablet 사이드바 정보 카드 (xl:hidden) */}

          {/* Mobile/Tablet: 모임 정보 카드 (탭 위에 배치) */}
          <div className='px-4 pt-6 md:px-8 xl:hidden'>
            <GatheringInfoCard gatheringId={gatheringId} />
          </div>

          {/* TODO: [이슈 3] 앵커 탭 네비게이션 */}

          <AnchorTabNav />

          <div className='px-4 pt-10 md:px-7 xl:flex xl:gap-20 xl:px-30'>
            <section className='min-w-0 flex-1'>
              <GatheringDetailContent gatheringId={gatheringId} />
              {/* TODO: [이슈 4] 주차별 계획 아코디언, 모집 인원 현황 */}
            </section>

            {/* Desktop: 사이드바 (sticky) */}
            <aside className='hidden xl:block xl:w-[560px] xl:shrink-0'>
              <GatheringInfoAside gatheringId={gatheringId} />
            </aside>
          </div>
          {/* Mobile/Tablet: 하단 고정 액션 바 */}
          <FloatingActionBar />
        </ErrorBoundary>
      </main>
    </HydrationBoundary>
  );
}
