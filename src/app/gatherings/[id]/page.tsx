import { Suspense } from 'react';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { GatheringHero } from './_components/GatheringHero';
import { GatheringDetailContainer } from './_components/GatheringDetailContainer';
import { GatheringDetailSkeleton } from './_components/GatheringDetailSkeleton';
import { MainGatheringStreaming } from './_components/GatheringStreaming';

interface GatheringDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function GatheringDetailPage({ params }: GatheringDetailPageProps) {
  const { id } = await params;
  const gatheringId = Number(id);

  return (
    <main className='mb-20 min-h-screen'>
      <MainGatheringStreaming>
        <GatheringDetailContainer gatheringId={gatheringId} />
      </MainGatheringStreaming>
    </main>
  );
}
