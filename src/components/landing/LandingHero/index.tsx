import Image from 'next/image';
import Link from 'next/link';

import { LANDING_IMAGES, LANDING_LINKS } from '@/components/landing/landingConstants';
import { buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

/**
 * Hero 배경 그라데이션 blob 위치/크기 (Figma node 52-24498 기준)
 *
 * 원본 캔버스 1920x992 위에서 blob 레이어가 (-73, 132) 위치에 2169x1087 크기로 배치되어
 * 섹션을 살짝 overflow하는 형태. 모든 값은 상위 섹션 대비 % 비율로 환산하여 viewport 독립적으로 동작.
 */
const HERO_BLOB_LAYER = {
  width: '113.0%',
  height: '109.6%',
  left: '-3.8%',
  top: '13.3%',
} as const;

const BLUE_BLOB_GRADIENT = 'bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,_#3779FE_0%,_rgba(55,121,254,0)_100%)]';
const CYAN_BLOB_GRADIENT = 'bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,_#00CCFF_0%,_rgba(0,204,255,0)_100%)]';

interface HeroBlob {
  gradientClass: string;
  opacityClass: string;
  width: string;
  height: string;
  left: string;
  top: string;
}

const HERO_BLOBS: readonly HeroBlob[] = [
  {
    gradientClass: BLUE_BLOB_GRADIENT,
    opacityClass: 'opacity-30',
    width: '61.23%',
    height: '69.83%',
    left: '38.77%',
    top: '27.78%',
  },
  {
    gradientClass: BLUE_BLOB_GRADIENT,
    opacityClass: 'opacity-30',
    width: '54.82%',
    height: '79.39%',
    left: '3.37%',
    top: '3.59%',
  },
  {
    gradientClass: CYAN_BLOB_GRADIENT,
    opacityClass: 'opacity-20',
    width: '50.30%',
    height: '59.89%',
    left: '0%',
    top: '40.11%',
  },
  {
    gradientClass: CYAN_BLOB_GRADIENT,
    opacityClass: 'opacity-20',
    width: '52.79%',
    height: '84.99%',
    left: '39.10%',
    top: '0%',
  },
];

export function LandingHero() {
  return (
    <section className='relative h-[512px] w-full overflow-hidden bg-[linear-gradient(180deg,#F1F8FF_0%,#DFEFFF_100%)] sm:h-[640px] md:h-[738px] lg:h-[992px]'>
      {/* Mobile: 하단 코너에만 은은한 blob (상단은 깨끗하게 유지) */}
      <div className='pointer-events-none absolute inset-0 md:hidden' aria-hidden>
        <div
          className={cn(
            'absolute bottom-[-17px] -left-24 h-[220px] w-[250px] blur-[1px]',
            BLUE_BLOB_GRADIENT,
            'opacity-20',
          )}
        />
        <div
          className={cn(
            'absolute -right-24 bottom-[-17px] h-[220px] w-[250px] blur-[1px]',
            CYAN_BLOB_GRADIENT,
            'opacity-18',
          )}
        />
      </div>

      <div className='pointer-events-none absolute hidden md:block' style={HERO_BLOB_LAYER} aria-hidden>
        {HERO_BLOBS.map((blob, index) => (
          <div
            key={index}
            className={cn('absolute', blob.gradientClass, blob.opacityClass)}
            style={{ width: blob.width, height: blob.height, left: blob.left, top: blob.top }}
          />
        ))}
      </div>

      <div
        className='pointer-events-none absolute inset-x-0 bottom-0 mx-auto flex w-full max-w-[440px] justify-center sm:max-w-[560px] md:max-w-[820px] lg:max-w-[1200px]'
        aria-hidden
      >
        <Image
          src={LANDING_IMAGES.heroImagePC}
          alt=''
          width={1200}
          height={700}
          priority
          className='h-auto w-full object-contain'
          sizes='(max-width: 640px) 440px, (max-width: 768px) 560px, (max-width: 1024px) 820px, 1200px'
        />
      </div>

      <div className='relative mx-auto w-full px-10 pt-[80px] md:px-36 md:pt-16 md:pb-20 lg:px-20 lg:pt-30 lg:pb-20'>
        <div className='flex flex-col items-center text-center'>
          <h1 className='text-h4-b md:text-h2-b lg:text-h1-b text-gradient-primary'>더 높은 완성도를 향한 항해</h1>
          <p className='text-small-02-r md:text-body-02-r lg:text-body-01-r mt-6 break-keep text-gray-800 md:max-w-[456px] lg:max-w-[569px]'>
            사이드 프로젝트와 스터디 팀을 만들고
            <br className='md:hidden' /> 목표를 관리하는 가장 확실한 방법.
            <br />
            매주 목표를 완성하며 &apos;완성&apos;이라는 섬에 도착하세요.
          </p>
          <div className='mt-12 flex w-full items-center justify-center gap-3'>
            <Link
              href={LANDING_LINKS.start}
              className={cn('group', buttonVariants({ variant: 'landing-start', size: 'landing-hero' }))}
            >
              <span className='relative inline-flex items-center justify-center whitespace-nowrap'>
                <span className='text-gray-0 transition-opacity group-hover:opacity-0'>시작하기</span>
                <span className='text-gradient-primary absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100'>
                  시작하기
                </span>
              </span>
            </Link>
            <Link
              href={LANDING_LINKS.browse}
              className={cn('group', buttonVariants({ variant: 'landing-browse', size: 'landing-hero' }))}
            >
              <span className='relative inline-block'>
                <span className='text-gradient-primary transition-opacity group-hover:opacity-0'>둘러보기</span>
                <span className='text-gray-0 absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100'>
                  둘러보기
                </span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
