import { SuspenseBoundary } from '@/components/SuspenseBoundary';

import { MyPageContent } from './_components/MyPageContent';
import { MyPageTabs } from './_components/MyPageTabs';
import { DEFAULT_TAB } from './_constants';

import type { MyPageTab } from './_constants';

interface MyPageProps {
  searchParams: Promise<{ tab?: MyPageTab }>;
}

export default async function MyPage({ searchParams }: MyPageProps) {
  const { tab } = await searchParams;
  const activeTab = tab ?? DEFAULT_TAB;

  return (
    <main className='min-h-screen bg-gray-50'>
      <MyPageTabs activeTab={activeTab} />
      <SuspenseBoundary
        pendingFallback={<p className='py-20 text-center text-gray-500'>불러오는 중...</p>}
        errorFallback={<p className='py-20 text-center text-gray-500'>데이터를 불러오는데 실패했습니다.</p>}
      >
        <MyPageContent activeTab={activeTab} />
      </SuspenseBoundary>
    </main>
  );
}
