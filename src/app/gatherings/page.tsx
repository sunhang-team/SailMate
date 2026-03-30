import { SearchForm } from '@/components/Search/SearchForm';
import { SearchHero } from '@/components/Search/SearchHero';
import { GatheringFilterBar } from '@/components/Search/GatheringFilterBar';

export default function GatheringsPage() {
  return (
    <main>
      <SearchHero>
        <SearchForm />
      </SearchHero>
      <section className='mx-auto flex max-w-[1680px] flex-col gap-12 px-4 py-10 md:px-7 md:py-15 xl:py-20'>
        <GatheringFilterBar totalCount={0} />
        {/* 카드 그리드 + 페이지네이션은 다음 태스크에서 추가 */}
      </section>
    </main>
  );
}
