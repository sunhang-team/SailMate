import { SuspenseBoundary } from '@/components/SuspenseBoundary';

import { CreateGatheringFunnel } from './CreateGatheringFunnel';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '모임 만들기',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function CreateGatheringPage() {
  return (
    <main className='mx-auto max-w-[1720px] px-4 pt-20 pb-40 md:px-7 xl:px-30'>
      <SuspenseBoundary
        pendingFallback={
          <div className='flex flex-col gap-8'>
            <div className='bg-gray-150 h-40 animate-pulse rounded-lg' />
            <div className='bg-gray-150 h-60 animate-pulse rounded-lg' />
          </div>
        }
        errorFallback={
          <div className='rounded-lg border border-gray-200 bg-gray-50 px-4 py-6'>
            <p className='text-body-02-r text-gray-500'>모임 만들기 정보를 불러올 수 없습니다</p>
          </div>
        }
      >
        <CreateGatheringFunnel />
      </SuspenseBoundary>
    </main>
  );
}
