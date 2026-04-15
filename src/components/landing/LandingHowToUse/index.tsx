'use client';

import { useRef } from 'react';
import { useScroll } from 'motion/react';

import { LandingRouteCards } from '@/components/landing/LandingHowToUse/LandingRouteCards';
import { LandingSectionHeading } from '@/components/landing/LandingSectionHeading';

export function LandingHowToUse() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section className='bg-gray-0 relative pt-16 md:pt-20 xl:pt-40'>
      <div ref={containerRef} className='mx-auto w-full'>
        <div className='pointer-events-none sticky top-0 z-10'>
          {/* 1. 실제 눈에 보이는 타이틀 본체 */}
          <div className='bg-gray-0/90 pointer-events-auto py-6 backdrop-blur-md'>
            <LandingSectionHeading eyebrow='How to use' title='완성도를 향해 항해하는 법' align='center' />
            <p className='text-small-02-r md:text-body-02-r xl:text-body-01-r mt-2 text-center text-gray-800'>
              스터디, 프로젝트 목표 달성을 위해 최적화된 4가지의 루트
            </p>
          </div>

          {/* 2. 👻 유령 블록: 타이틀의 발끝을 카드 발끝 위치까지 억지로 늘려줍니다! 
                이제 바닥이 올라올 때 카드와 타이틀의 발끝을 "동시에" 치게 됩니다. */}
          <div className='h-[500px] w-full xl:h-[800px]' />
        </div>

        {/* 3. 카드 섹션: 유령 블록이 불필요한 공간을 차지했으니, 
              음수 마진(-mt)을 줘서 카드를 원래 위치로 쏙 끌어올립니다. */}
        <div className='relative z-0 -mt-[500px] xl:-mt-[800px]'>
          <LandingRouteCards scrollYProgress={scrollYProgress} />
        </div>
      </div>
    </section>
  );
}
