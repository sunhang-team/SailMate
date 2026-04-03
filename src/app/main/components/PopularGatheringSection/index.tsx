'use client';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PopularGatheringList } from './PopularGatheringList';

export function PopularGatheringSection() {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div className='p-4 text-center text-red-500'>
          <p>인기 모임을 불러올 수 없습니다.</p>
          <button onClick={reset} className='mt-2 underline'>
            다시 시도
          </button>
        </div>
      )}
    >
      <PopularGatheringList />
    </ErrorBoundary>
  );
}
