import { type ReactNode } from 'react';

interface SearchHeroProps {
  children: ReactNode;
}

export function SearchHero({ children }: SearchHeroProps) {
  return (
    <section className='bg-gradient-sub-200 w-full'>
      <div className='mx-auto flex max-w-[1680px] flex-col items-center px-4 pt-20 pb-8 md:px-7 md:pb-13 xl:pb-20'>
        <div className='flex flex-col items-center gap-4'>
          <p className='text-small-02-m md:text-body-02-sb xl:text-body-01-sb font-semibold text-blue-400 md:font-semibold'>
            모임 탐색
          </p>
          <h1 className='text-h5-b md:text-h3-b xl:text-h2-b text-gray-900'>원하는 모임을 찾아보세요.</h1>
        </div>
        <div className='mt-6 w-full'>{children}</div>
      </div>
    </section>
  );
}
