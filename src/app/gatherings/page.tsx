import { SearchForm } from '@/components/Search/SearchForm';
import { SearchHero } from '@/components/Search/SearchHero';

export default function SearchPage() {
  return (
    <main>
      <SearchHero>
        <SearchForm />
      </SearchHero>
      {/* 결과 영역은 다음 이슈에서 추가 */}
    </main>
  );
}
