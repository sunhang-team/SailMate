import { RetryButton } from './RetryButton';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '오프라인',
};

export default function OfflinePage() {
  return (
    <main className='flex min-h-[calc(100dvh_-_48px)] flex-col items-center justify-center gap-3 px-6 text-center md:min-h-[calc(100dvh_-_88px)]'>
      <h1 className='text-h5-b text-gray-800'>오프라인이에요</h1>
      <p className='text-body-01-r text-gray-500'>
        네트워크 연결이 끊겼어요.
        <br />
        연결 상태를 확인하고 다시 시도해 주세요.
      </p>
      <RetryButton />
    </main>
  );
}
