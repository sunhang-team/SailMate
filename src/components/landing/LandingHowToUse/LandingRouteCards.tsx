'use client';

import Image from 'next/image';

import { LANDING_ROUTE_STEPS } from '@/components/landing/landingConstants';
import { useElementInViewOnce } from '@/hooks/useElementInViewOnce';
import { Tag } from '@/components/ui/Tag';
import {
  LandingAddIcon,
  LandingFlagIcon,
  LandingPaperIcon,
  LandingSearchIcon,
  LandingCheckIcon,
  LandingActivityIcon,
  LandingLocationIcon,
  LandingHeartIcon,
} from '@/components/ui/Icon';
import { cn } from '@/lib/cn';

interface RouteStepCardProps {
  routeLabel: string;
  title: string;
  description: string;
  imageSrcPC: string;
  imageSrcTablet: string;
  imageSrcMobile: string;
  imageAlt: string;
  imageSide: 'left' | 'right';
}

interface RouteMetaItem {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
}

const ROUTE_META: Record<string, readonly [RouteMetaItem, RouteMetaItem]> = {
  'Route 1': [
    { icon: LandingSearchIcon, label: '모임 탐색' },
    { icon: LandingAddIcon, label: '모임 만들기' },
  ],
  'Route 2': [
    { icon: LandingFlagIcon, label: '모임 최종 목표' },
    { icon: LandingCheckIcon, label: '이번주 할 일' },
  ],
  'Route 3': [
    { icon: LandingActivityIcon, label: '팀 달성률' },
    { icon: LandingLocationIcon, label: '완성도까지 거리' },
  ],
  'Route 4': [
    { icon: LandingPaperIcon, label: '리뷰' },
    { icon: LandingHeartIcon, label: '활동 에너지' },
  ],
} as const;

function RouteStepCard({
  routeLabel,
  title,
  description,
  imageSrcPC,
  imageSrcTablet,
  imageSrcMobile,
  imageAlt,
  imageSide,
}: RouteStepCardProps) {
  const { ref, isVisible } = useElementInViewOnce();

  const meta = ROUTE_META[routeLabel];

  const textBlock = (
    <div className='flex flex-1 flex-col items-center justify-center gap-3 bg-gray-100 px-2 py-6 text-center md:px-29 md:py-15 lg:items-start lg:px-25 lg:py-15 lg:text-left'>
      <Tag variant='route'>{routeLabel}</Tag>
      <h3 className='text-h4-b max-md:text-h5-b mb-2 text-gray-900'>{title}</h3>
      <p className='text-small-01-r lg:text-body-01-r md:text-body-02-r break-keep text-gray-800'>{description}</p>
      {meta && (
        <div className='mt-25 flex flex-wrap items-center justify-center gap-8 lg:justify-start'>
          {meta.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className='flex items-center gap-3 text-gray-700'>
                <Icon size={44} className='shrink-0' />
                <span className='lg:text-body-01-sb md:text-body-02-sb text-small-02-sb max-md:text-small-01-sb'>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const imageBlock = (
    <div className='border-gray-150 flex flex-1 items-center justify-center bg-gray-100 p-4 md:p-6 lg:p-8'>
      <Image
        src={imageSrcPC}
        alt={imageAlt}
        width={800}
        height={488}
        className='hidden h-auto max-h-[420px] w-full object-contain lg:block'
        sizes='50vw'
      />
      <Image
        src={imageSrcTablet}
        alt={imageAlt}
        width={632}
        height={386}
        className='hidden h-auto max-h-[380px] w-full object-contain md:block lg:hidden'
        sizes='(min-width: 768px) 50vw'
      />
      <Image
        src={imageSrcMobile}
        alt={imageAlt}
        width={311}
        height={190}
        className='block h-auto max-h-[320px] w-full object-contain md:hidden'
        sizes='(max-width: 768px) 100vw, 50vw'
      />
    </div>
  );

  return (
    <article
      ref={ref}
      data-visible={isVisible}
      className={cn(
        'shadow-02 bg-gray-0 flex flex-col overflow-hidden rounded-2xl transition-[opacity,transform] duration-700 ease-out md:items-stretch lg:flex-row',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0',
      )}
    >
      {imageSide === 'left' ? (
        <>
          {imageBlock}
          {textBlock}
        </>
      ) : (
        <>
          {textBlock}
          {imageBlock}
        </>
      )}
    </article>
  );
}

export function LandingRouteCards() {
  return (
    <div className='mt-12 flex flex-col gap-10 md:mt-14 md:gap-10 lg:mt-16 lg:px-30'>
      {LANDING_ROUTE_STEPS.map((step, index) => (
        <div key={step.routeLabel} className='lg:sticky lg:top-20' style={{ zIndex: index + 1 }}>
          <RouteStepCard
            routeLabel={step.routeLabel}
            title={step.title}
            description={step.description}
            imageSrcPC={step.imageSrcPC}
            imageSrcTablet={step.imageSrcTablet}
            imageSrcMobile={step.imageSrcMobile}
            imageAlt={step.imageAlt}
            imageSide={step.imageSide}
          />
        </div>
      ))}
    </div>
  );
}
