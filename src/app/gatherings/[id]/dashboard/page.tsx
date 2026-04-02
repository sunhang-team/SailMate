import { SuspenseBoundary } from '@/components/SuspenseBoundary';

import { DashboardContent } from './_components/DashboardContent';
import { DashboardHeader } from './_components/DashboardHeader';
import { DashboardSkeleton } from './_components/DashboardSkeleton';
import { DashboardTabNav } from './_components/DashboardTabNav';
import { DEFAULT_TAB } from './_constants';

import type { DashboardTab } from './_constants';

interface DashboardPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: DashboardTab }>;
}

export default async function DashboardPage({ params, searchParams }: DashboardPageProps) {
  const { id } = await params;
  const { tab } = await searchParams;
  const gatheringId = Number(id);
  const activeTab = tab ?? DEFAULT_TAB;

  return (
    <main className='min-h-screen bg-gray-50'>
      <SuspenseBoundary
        pendingFallback={<DashboardSkeleton />}
        errorFallback={<p className='py-20 text-center text-gray-500'>대시보드 정보를 불러오는데 실패했습니다.</p>}
      >
        <DashboardHeader gatheringId={gatheringId} />
      </SuspenseBoundary>

      <DashboardTabNav activeTab={activeTab} gatheringId={gatheringId} />
      <DashboardContent activeTab={activeTab} gatheringId={gatheringId} />
    </main>
  );
}
