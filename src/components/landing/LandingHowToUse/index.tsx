'use client';

import { useRef, useState } from 'react';
import { useScroll, motion } from 'motion/react';

import { LandingRouteCards } from '@/components/landing/LandingHowToUse/LandingRouteCards';
import { LandingSectionHeading } from '@/components/landing/LandingSectionHeading';

export function LandingHowToUse() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHeaderSticky, setIsHeaderSticky] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section ref={containerRef} className='bg-gray-0 relative py-16 md:py-20 xl:py-40'>
      <div className='mx-auto w-full'>
        <div className={isHeaderSticky ? 'bg-gray-0 sticky top-0 z-10 backdrop-blur' : 'static'}>
          <LandingSectionHeading eyebrow='How to use' title='완성도를 향해 항해하는 법' align='center' />
          <p className='text-small-02-r md:text-body-02-r xl:text-body-01-r mt-2 text-center text-gray-800'>
            스터디, 프로젝트 목표 달성을 위해 최적화된 4가지의 루트
          </p>
        </div>
        <LandingRouteCards
          scrollYProgress={scrollYProgress}
          onLastCardVisible={(visible) => setIsHeaderSticky(!visible)}
        />
      </div>
    </section>
  );
}
