'use client';

import { useAuth } from '@/hooks/useAuth';
import { SuspenseBoundary } from '@/components/SuspenseBoundary';
import { MyGatheringList } from './MyGatheringList';

export function MyGatheringSection() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return null;
  }

  return (
    <SuspenseBoundary
      pendingFallback={<div className='p-4 text-center text-gray-500'>모임을 불러오는 중입니다...</div>}
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
