'use client';

import type { ReactNode } from 'react';

import { SuspenseBoundary } from '@/components/SuspenseBoundary';
import { GatheringSectionSkeleton } from '@/app/main/components/GatheringSectionSkeleton';

interface MainGatheringStreamingProps {
  children: ReactNode;
}

export function MainGatheringStreaming({ children }: MainGatheringStreamingProps) {
  return (
    <SuspenseBoundary
      pendingFallback={<GatheringSectionSkeleton />}
      errorFallback={(_error, reset) => (
        <div className='flex flex-col items-center justify-center gap-4 py-20 text-center'>
          <p className='text-body-01-m text-gray-500'>모임 목록을 불러오지 못했습니다.</p>
          <button
            onClick={reset}
            className='text-body-02-sb cursor-pointer text-blue-500 underline decoration-1 underline-offset-4 transition-colors hover:text-blue-600'
          >
            다시 시도하기
          </button>
        </div>
      )}
    >
      {children}
    </SuspenseBoundary>
  );
}
