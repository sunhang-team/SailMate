import { GatheringList } from '@/components/Search/GatheringList';
import { GatheringListSkeleton } from '@/components/Search/GatheringList/Skeleton';
import { SearchForm } from '@/components/Search/SearchForm';
import { SearchHero } from '@/components/Search/SearchHero';
import { SuspenseBoundary } from '@/components/SuspenseBoundary';
import { getDefaultOpenGraph } from '@/lib/seo';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '모임 검색',
  description:
    '카테고리·키워드로 스터디와 프로젝트 모임을 찾아보세요. 완성도에서 함께할 팀원을 만나 끝까지 완주하세요.',
  alternates: { canonical: '/gatherings' },
  openGraph: {
    ...getDefaultOpenGraph(),
    url: '/gatherings',
    title: '모임 검색 | 완성도',
  },
};

export default function GatheringsPage() {
  return (
    <main className='min-h-screen'>
      <SearchHero>
        <SearchForm />
      </SearchHero>
      <section className='mx-auto flex max-w-[1680px] flex-col gap-12 px-4 py-10 md:px-7 md:py-15 xl:py-20'>
        <SuspenseBoundary
          pendingFallback={<GatheringListSkeleton />}
          errorFallback={
            <p className='text-body-02-r py-20 text-center text-gray-500'>데이터를 불러오는데 실패했습니다.</p>
          }
        >
          <GatheringList />
        </SuspenseBoundary>
      </section>
    </main>
  );
}
