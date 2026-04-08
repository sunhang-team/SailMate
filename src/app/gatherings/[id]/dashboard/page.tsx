import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { fetchGatheringDetail } from '@/api/gatherings';
import { SuspenseBoundary } from '@/components/SuspenseBoundary';
import { getUserIdFromToken } from '@/lib/getUserIdFromToken';

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

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const hasRefreshToken = cookieStore.has('refreshToken');
  const userId = getUserIdFromToken(accessToken);

  // accessToken 없지만 refreshToken 있으면 클라이언트에서 리프레시 처리 → 검증 스킵
  if (userId !== null) {
    try {
      const gathering = await fetchGatheringDetail(gatheringId);
      const isMember = gathering.members.some((m) => m.userId === userId);
      if (!isMember) redirect(`/gatherings/${gatheringId}`);
    } catch {
      redirect(`/gatherings/${gatheringId}`);
    }
  } else if (!hasRefreshToken) {
    redirect(`/gatherings/${gatheringId}`);
  }

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
