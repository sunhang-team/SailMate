import { Suspense } from 'react';

import { GatheringSectionSkeleton } from '@/app/main/components/GatheringSectionSkeleton';

import { HeroSection } from './components/HeroSection';
import { MainGatheringContainer } from './components/MainGatheringContainer';
import { MyGatheringSection } from './components/MyGatheringSection';

export const revalidate = 3600;

export default async function MainPage() {
  return (
    <>
      <HeroSection />
      <div className='mx-auto flex w-full max-w-[1920px] flex-col gap-15 px-4 py-10 md:gap-26 md:px-7 md:py-20 lg:gap-30 lg:px-12 lg:py-24 xl:px-20 2xl:px-30'>
        <MyGatheringSection />
        <Suspense fallback={<GatheringSectionSkeleton />}>
          <MainGatheringContainer />
        </Suspense>
      </div>
    </>
  );
}
