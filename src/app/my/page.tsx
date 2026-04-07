import { MyPageContent } from './_components/MyPageContent';
import { MyPageTabs } from './_components/MyPageTabs';
import { ProfileSidebar, ProfileSidebarSkeleton } from './_components/ProfileSidebar';
import { DEFAULT_TAB } from './_constants';
import { SuspenseBoundary } from '@/components/SuspenseBoundary';

import type { MyPageTab } from './_constants';

interface MyPageProps {
  searchParams: Promise<{ tab?: MyPageTab }>;
}

export default async function MyPage({ searchParams }: MyPageProps) {
  const { tab } = await searchParams;
  const activeTab = tab ?? DEFAULT_TAB;

  return (
    <main className='min-h-screen bg-gray-50'>
      <div className='px-4 py-6 md:px-7 lg:px-15'>
        <h1 className='text-body-01-b md:text-h4-b lg:text-h3-b mt-12'>마이페이지</h1>
        <div className='mt-11 flex flex-col gap-8 lg:flex-row lg:items-start'>
          <SuspenseBoundary
            pendingFallback={<ProfileSidebarSkeleton />}
            errorFallback={<p className='py-10 text-center text-gray-500'>프로필을 불러오지 못했습니다.</p>}
          >
            <ProfileSidebar />
          </SuspenseBoundary>

          <div className='min-w-0 flex-1'>
            <MyPageTabs activeTab={activeTab} />
            <MyPageContent activeTab={activeTab} />
          </div>
        </div>
      </div>
    </main>
  );
}
