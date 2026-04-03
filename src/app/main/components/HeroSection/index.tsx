import Link from 'next/link';

import { SearchIcon } from '@/components/ui/Icon';

export function HeroSection() {
  return (
    <section className='bg-gradient-sub-200 flex w-full flex-col items-center justify-center py-20'>
      <div className='mb-6 flex flex-col items-center justify-center gap-4'>
        <h1 className='text-small-02-sb md:text-body-02-sb lg:text-body-01-sb text-blue-400'>모임 탐색</h1>
        <h2 className='text-h5-b md:text-h3-b lg:text-h2-b text-gray-900'>원하는 모임을 찾아보세요.</h2>
      </div>
      <Link
        href='/gatherings'
        className='bg-gray-0 border-gradient-primary text-small-01-r md:text-body-01-r flex h-13.5 w-fit items-center gap-2 rounded-[50px] p-4 px-6.25 md:h-18 md:w-[258px] md:px-7'
      >
        <SearchIcon className='h-5 w-5 md:h-7 md:w-7' gradient />
        <span className='text-gradient-primary'>키워드를 검색하세요.</span>
      </Link>
    </section>
  );
}
