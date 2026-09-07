import { MainHeroSearchForm } from './MainHeroSearchForm';

export function HeroSection() {
  return (
    <section className='bg-gradient-sub-200 w-full'>
      <div className='mx-auto flex h-[277px] w-[calc(100%_-_32px)] max-w-420 flex-col items-center pt-[50px] min-[744px]:h-[419px] min-[744px]:w-[calc(100%_-_56px)] min-[744px]:pt-20 xl:h-[382px] xl:w-[calc(100%_-_clamp(56px,_12.5vw,_240px))] xl:max-w-none'>
        <div className='mb-5 flex w-[247px] flex-col items-center justify-center gap-4 min-[744px]:mb-8 min-[744px]:w-[410px] xl:gap-2'>
          <h1 className='text-small-02-sb min-[744px]:text-body-02-sb xl:text-body-01-sb text-blue-400'>모임 탐색</h1>
          <h2 className='text-h5-b min-[744px]:text-h3-b xl:text-h2-b w-full text-center whitespace-nowrap text-gray-900'>
            원하는 모임을 찾아보세요.
          </h2>
        </div>
        <MainHeroSearchForm />
      </div>
    </section>
  );
}
