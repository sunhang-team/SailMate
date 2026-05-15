import { SuspenseBoundary } from '@/components/SuspenseBoundary';

import { CreateGatheringForm } from './CreateGatheringForm';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '모임 만들기',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function CreateGatheringPage() {
  return (
    <main className='mx-auto max-w-[1680px] px-5 pt-20 pb-40'>
      <h1 className='text-body-01-b md:text-h4-b lg:text-h3-b mb-8 text-gray-900'>모임 만들기</h1>
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
        <CreateGatheringForm />
      </SuspenseBoundary>
    </main>
  );
}
