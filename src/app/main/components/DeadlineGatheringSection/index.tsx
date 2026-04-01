'use client';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { DeadlineGatheringList } from './DeadlineGatheringList';

export function DeadlineGatheringSection() {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div className='p-4 text-center text-red-500'>
          <p>마감 임박 모임을 불러올 수 없습니다.</p>
          <button onClick={reset} className='mt-2 underline'>
            다시 시도
          </button>
        </div>
      )}
    >
      <DeadlineGatheringList />
    </ErrorBoundary>
  );
}
