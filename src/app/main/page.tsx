import { HeroSection } from './components/HeroSection';
import { MyGatheringSection } from './components/MyGatheringSection';
import { MainGatheringContainer } from './components/MainGatheringContainer';
import { MainGatheringStreaming } from './components/MainGatheringStreaming';
import { getDefaultOpenGraph } from '@/lib/seo';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '추천 모임',
  description:
    '인기·마감임박·최신 스터디와 프로젝트 모임을 한눈에. 완성도에서 관심사 맞는 팀원을 찾아 함께 완주하세요.',
  alternates: { canonical: '/main' },
  openGraph: {
    ...getDefaultOpenGraph(),
    url: '/main',
    title: '추천 모임 | 완성도',
  },
};

export const revalidate = 3600;

export default async function MainPage() {
  return (
    <>
      <HeroSection />
      <div className='mx-auto flex w-full max-w-[1920px] flex-col gap-15 px-4 py-10 md:gap-26 md:px-7 md:py-20 lg:gap-30 lg:px-12 lg:pt-25 lg:pb-40 xl:px-20 2xl:px-30'>
        <MyGatheringSection />
        <MainGatheringStreaming>
          <MainGatheringContainer />
        </MainGatheringStreaming>
      </div>
    </>
  );
}
