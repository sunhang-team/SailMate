'use client';

import { GatheringSectionSkeleton } from '@/components/GatheringSectionSkeleton';
import { SuspenseBoundary } from '@/components/SuspenseBoundary';
import { useAuth } from '@/hooks/useAuth';

import { MyGatheringList } from './MyGatheringList';

export function MyGatheringSection() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return null;
  }

  return (
    <SuspenseBoundary
      // 🟢 단순 텍스트 대신 새로 만든 고퀄리티 스켈레톤을 적용합니다.
      pendingFallback={<GatheringSectionSkeleton />}
      errorFallback={(error, reset) => (
        <div className='p-4 text-center text-red-500'>
          <p>모임을 불러올 수 없습니다.</p>
          <button onClick={reset} className='mt-2 underline'>
            다시 시도
          </button>
        </div>
      )}
    >
      <MyGatheringList />
    </SuspenseBoundary>
  );
}
