'use client';

import { GatheringSectionSkeleton } from '@/app/main/components/GatheringSectionSkeleton';
import { SuspenseBoundary } from '@/components/SuspenseBoundary';
import { LatestGatheringList } from './LatestGatheringList';

export function LatestGatheringSection() {
  return (
    <SuspenseBoundary
      pendingFallback={<GatheringSectionSkeleton />}
      errorFallback={(error, reset) => (
        <div className='p-4 text-center text-red-500'>
          <p>최신 모임을 불러올 수 없습니다.</p>
          <button onClick={reset} className='mt-2 underline'>
            다시 시도
          </button>
        </div>
      )}
    >
      <LatestGatheringList />
    </SuspenseBoundary>
  );
}
