import { LandingRouteCards } from '@/components/landing/LandingHowToUse/LandingRouteCards';
import { LandingSectionHeading } from '@/components/landing/LandingSectionHeading';

export function LandingHowToUse() {
  return (
    <section className='bg-gray-0 py-16 md:py-20 lg:py-24'>
      <div className='mx-auto w-full'>
        <LandingSectionHeading eyebrow='How to use' title='완성도를 향해 항해하는 법' align='center' />
        <p className='text-small-02-r md:text-body-02-r lg:text-body-01-r mt-2 text-center text-gray-800'>
          스터디, 프로젝트 목표 달성을 위해 최적화된 4가지의 루트
        </p>
        <LandingRouteCards />
      </div>
    </section>
  );
}
