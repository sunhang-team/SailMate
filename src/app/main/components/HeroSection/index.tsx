import { MainHeroSearchForm } from './MainHeroSearchForm';

export function HeroSection() {
  return (
    <section className='bg-gradient-sub-200 w-full'>
      <div className='mx-auto flex max-w-420 flex-col items-center px-4 pt-20 pb-10 md:px-7 md:pb-14 xl:pb-20'>
        <div className='mb-10 flex flex-col items-center justify-center gap-4 md:mb-12'>
          <h1 className='text-small-02-sb md:text-body-02-sb lg:text-body-01-sb text-blue-400'>모임 탐색</h1>
          <h2 className='text-h5-b md:text-h3-b lg:text-h2-b text-gray-900'>원하는 모임을 찾아보세요.</h2>
        </div>
        <MainHeroSearchForm />
      </div>
    </section>
  );
}
