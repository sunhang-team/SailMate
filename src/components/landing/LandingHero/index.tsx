import Image from 'next/image';
import Link from 'next/link';

import { LANDING_IMAGES, LANDING_LINKS } from '@/components/landing/landingConstants';
import { buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

export function LandingHero() {
  return (
    <section className='relative h-[512px] w-full overflow-hidden md:h-[738px] lg:h-[992px]'>
      <div className='pointer-events-none absolute inset-0' aria-hidden>
        <div className='relative hidden h-full w-full lg:block'>
          <Image src={LANDING_IMAGES.heroImagePC} alt='' fill className='object-cover' priority sizes='100vw' />
        </div>

        <div className='relative hidden h-full w-full md:block lg:hidden'>
          <Image src={LANDING_IMAGES.heroImageTablet} alt='' fill className='object-cover' priority sizes='100vw' />
        </div>

        <div className='relative block h-full w-full md:hidden'>
          <Image
            src={LANDING_IMAGES.heroImageMobile}
            alt=''
            fill
            className='object-cover object-top'
            priority
            sizes='100vw'
          />
        </div>
      </div>

      <div className='relative mx-auto w-full px-10 pt-[80px] md:px-36 md:pt-16 md:pb-20 lg:pt-20 lg:pb-24'>
        {/* 예시처럼: 상단 카피/버튼, 하단 노트북 이미지 */}
        <div className='flex flex-col items-center text-center'>
          <h1 className='text-gradient-primary lg:text-h1-b md:text-h2-b text-h4-b'>더 높은 완성도를 향한 항해</h1>
          <p className='md:text-body-02-r lg:text-body-01-r mt-6 hidden break-keep text-gray-800 md:block md:max-w-[456px] lg:max-w-[569px]'>
            사이드 프로젝트와 스터디 팀을 만들고 목표를 관리하는 가장 확실한 방법.
            <br />
            매주 목표를 완성하며 &apos;완성&apos;이라는 섬에 도착하세요.
          </p>

          {/* 💡 4. 모바일용 텍스트 (PC에서는 숨김) -> 여기서 '만들고' 뒤에 완벽하게 줄바꿈! */}
          <p className='text-small-02-r mt-6 block break-keep text-gray-800 md:hidden'>
            사이드 프로젝트와 스터디 팀을 만들고
            <br />
            목표를 관리하는 가장 확실한 방법.
            <br />
            매주 목표를 완성하며 &apos;완성&apos;이라는 섬에 도착하세요.
          </p>
          <div className='mt-12 flex w-full items-center justify-center gap-3'>
            <Link
              href={LANDING_LINKS.start}
              className={cn(buttonVariants({ variant: 'landing-start', size: 'landing-hero' }))}
            >
              시작하기
            </Link>
            <Link
              href={LANDING_LINKS.browse}
              className={cn(buttonVariants({ variant: 'landing-browse', size: 'landing-hero' }))}
            >
              둘러보기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
