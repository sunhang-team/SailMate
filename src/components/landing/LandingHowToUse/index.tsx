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
          <div className='h-[500px] w-full xl:h-[800px]' />
        </div>
        <div className='relative z-0 -mt-[500px] xl:-mt-[800px]'>
          <LandingRouteCards scrollYProgress={scrollYProgress} />
        </div>
      </div>
    </section>
  );
}
