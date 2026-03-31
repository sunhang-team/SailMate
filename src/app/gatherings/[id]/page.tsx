import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { getQueryClient } from '@/lib/getQueryClient';
import { gatheringQueries } from '@/api/gatherings/queries';

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
      <main className='min-h-screen'>
        <ErrorBoundary
          fallback={<p className='py-20 text-center text-gray-500'>모임 정보를 불러오는데 실패했습니다.</p>}
        >
          <GatheringHero gatheringId={gatheringId} />

          {/* TODO: [이슈 2] Mobile/Tablet 사이드바 정보 카드 (xl:hidden) */}
          {/* TODO: [이슈 3] 앵커 탭 네비게이션 */}

          <div className='mx-auto max-w-[1680px] px-4 md:px-7 xl:flex xl:gap-20 xl:px-0'>
            <section className='min-w-0 flex-1'>
              {/* TODO: [이슈 3] 모임 설명, 이미지 캐러셀, 모집/활동 기간, 최종 목표 */}
              {/* TODO: [이슈 4] 주차별 계획 아코디언, 모집 인원 현황 */}
            </section>

            <aside className='hidden xl:block xl:w-[560px] xl:shrink-0'>
              {/* TODO: [이슈 2] Desktop 사이드바 (sticky) */}
            </aside>
          </div>
        </ErrorBoundary>
      </main>
    </HydrationBoundary>
  );
}
