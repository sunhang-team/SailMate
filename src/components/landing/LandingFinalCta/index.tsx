import Image from 'next/image';
import Link from 'next/link';

import { LANDING_IMAGES, LANDING_LINKS } from '@/components/landing/landingConstants';
import { buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

export function LandingFinalCta() {
  return (
    <section className='relative overflow-hidden py-16 md:py-20 lg:py-30'>
      <div className='pointer-events-none absolute inset-0' aria-hidden>
        <Image src={LANDING_IMAGES.bottomImage} alt='' fill className='object-cover' sizes='100vw' />
      </div>
      <div className='relative mx-auto flex w-full max-w-[720px] flex-col items-center px-6 text-center'>
        <p className='text-small-01-b md:text-h5-b lg:text-h4-b text-blue-500'>
          더 나은 완성도를 위한 가장 확실한 선택
        </p>
        <h2 className='text-body-01-b md:text-h3-b lg:text-h2-b mt-3 mb-7 text-blue-500'>
          지금 <span className='text-gradient-primary'>완성도</span>에서{' '}
          <span className='text-gradient-primary'>항해</span>를 시작하세요.
        </h2>
        <Link
          href={LANDING_LINKS.start}
          className={cn(buttonVariants({ variant: 'landing-start', size: 'landing-hero' }))}
        >
          시작하기
        </Link>
      </div>
    </section>
  );
}
