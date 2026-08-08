import { type ReactNode } from 'react';

interface SearchHeroProps {
  children: ReactNode;
}

export function SearchHero({ children }: SearchHeroProps) {
  return (
    <section className='bg-gradient-sub-200 w-full'>
      <div className='mx-auto flex max-w-420 flex-col items-center px-4 pt-20 pb-10 md:px-7 md:pb-14 xl:pb-20'>
        <div className='mb-10 flex flex-col items-center gap-4 md:mb-12'>
          <p className='text-small-02-m md:text-body-02-sb xl:text-body-01-sb font-semibold text-blue-400 md:font-semibold'>
            모임 탐색
          </p>
          <h1 className='text-h5-b md:text-h3-b xl:text-h2-b text-gray-900'>원하는 모임을 찾아보세요.</h1>
        </div>
        {children}
      </div>
    </section>
  );
}
