'use client';

import { GatheringDetailSkeleton } from '../GatheringDetailSkeleton';
import { SuspenseBoundary } from '@/components/SuspenseBoundary';

import type { ReactNode } from 'react';

interface GatheringStreamingProps {
  children: ReactNode;
}

export function MainGatheringStreaming({ children }: GatheringStreamingProps) {
  return (
    <SuspenseBoundary
      pendingFallback={<GatheringDetailSkeleton />}
      errorFallback={(_error, reset) => (
        <div className='flex flex-col items-center justify-center gap-4 py-20 text-center'>
          <p className='text-body-01-m text-gray-500'>모임 정보를 불러오는 데 실패했습니다.</p>
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
