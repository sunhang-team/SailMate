import { GatheringList } from '@/components/Search/GatheringList';
import { GatheringListSkeleton } from '@/components/Search/GatheringList/Skeleton';
import { SearchForm } from '@/components/Search/SearchForm';
import { SearchHero } from '@/components/Search/SearchHero';
import { SuspenseBoundary } from '@/components/SuspenseBoundary';

export default function GatheringsPage() {
  return (
    <main className='min-h-screen'>
      <SearchHero>
        <SearchForm />
      </SearchHero>
      <section className='mx-auto flex max-w-[1680px] flex-col gap-12 px-4 py-10 md:px-7 md:py-15 xl:px-30 xl:py-20'>
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
