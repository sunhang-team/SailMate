import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { fetchGatheringDetail } from '@/api/gatherings';
import { SuspenseBoundary } from '@/components/SuspenseBoundary';
import { getUserIdFromToken } from '@/lib/getUserIdFromToken';
import { isMswEnabled } from '@/lib/msw';

import { DashboardContent } from './_components/DashboardContent';
import { DashboardHeader } from './_components/DashboardHeader';
import { DashboardSkeleton } from './_components/DashboardSkeleton';
import { DashboardTabNav } from './_components/DashboardTabNav';
import { DashboardViewTracker } from './_components/DashboardViewTracker';
import { DEFAULT_TAB } from './_constants';

import type { Metadata } from 'next';
import type { DashboardTab } from './_constants';

export const metadata: Metadata = {
  title: '모임 대시보드',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

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
      // TEMP: 백엔드 재배포 전까지 Vercel production MSW 배포에서도 대시보드 시연을 허용한다.
      // MSW 환경 — Next.js 16 + Turbopack에서 msw/node가 서버 fetch를 못 잡는 경우가 있음.
      if (!isMswEnabled) redirect(`/gatherings/${gatheringId}`);
    }
  } else if (!hasRefreshToken && !isMswEnabled) {
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
      <DashboardViewTracker gatheringId={gatheringId} tab={activeTab} />
    </main>
  );
}
