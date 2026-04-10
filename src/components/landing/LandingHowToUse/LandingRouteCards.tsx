'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'motion/react';

import { LANDING_ROUTE_STEPS, type RouteLabel } from '@/components/landing/landingConstants';
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

/** scroll progress 기준, 다음 카드가 덮으러 올 때 이전 카드 transition이 시작되는 구간 비율 */
const TRANSITION_WINDOW_RATIO = 0.12;
/** 이전 카드 최소 scale (덮일 때 살짝 축소되는 깊이감) */
const MIN_SCALE = 0.98;

interface RouteStepCardProps {
  routeLabel: RouteLabel;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  imageSide: 'left' | 'right';
  index: number;
  totalCards: number;
  scrollProgress: MotionValue<number>;
}

interface RouteMetaItem {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
}

const ROUTE_META: Record<RouteLabel, readonly [RouteMetaItem, RouteMetaItem]> = {
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
};

function RouteStepCard({
  routeLabel,
  title,
  description,
  imageSrc,
  imageAlt,
  imageSide,
  index,
  totalCards,
  scrollProgress,
}: RouteStepCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const isFirst = index === 0;
  const isLast = index === totalCards - 1;

  // 다음 카드가 덮으러 올 때 이전 카드에 점진적으로 블러/축소 적용
  // scrollProgress 기준 (N+1)/totalCards 시점이 카드 N이 완전히 덮이는 시점
  const transitionEnd = (index + 1) / totalCards;
  const transitionStart = transitionEnd - TRANSITION_WINDOW_RATIO;

  const scale = useTransform(scrollProgress, [transitionStart, transitionEnd], [1, isLast ? 1 : MIN_SCALE]);

  const meta = ROUTE_META[routeLabel];
  const enableScrollEffects = !shouldReduceMotion;

  const textBlock = (
    <div className='flex flex-1 flex-col items-center justify-center gap-3 bg-gray-100 px-2 py-6 text-center md:px-29 md:py-15 xl:items-start xl:px-25 xl:py-15 xl:text-left'>
      <Tag variant='route'>{routeLabel}</Tag>
      <h3 className='text-body-01-b md:text-h4-b lg:text-h3-b mb-2 break-keep text-gray-900'>{title}</h3>
      <p className='text-small-02-r md:text-body-02-r lg:text-body-01-r break-keep text-gray-800'>{description}</p>
      <div className='mt-6 flex flex-wrap items-center justify-center gap-8 md:mt-10 xl:mt-25 xl:justify-start'>
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
    </div>
  );

  const imageBlock = (
    <div className='flex flex-1 items-center justify-center bg-gray-100 p-4 md:p-6 xl:p-8'>
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={1600}
        height={976}
        className='h-auto max-h-[320px] w-full object-contain md:max-h-[380px] lg:max-h-[420px]'
        sizes='(max-width: 768px) 100vw, 50vw'
      />
    </div>
  );

  return (
    <div
      className={cn('sticky top-20', !isFirst && 'mt-[40vh] md:mt-[55vh] lg:mt-[50vh]')}
      style={{ zIndex: index + 1 }}
    >
      <motion.article
        initial={shouldReduceMotion ? false : { opacity: 0, y: 80 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={enableScrollEffects ? { scale } : undefined}
        className='shadow-02 flex flex-col overflow-hidden rounded-2xl md:items-stretch xl:flex-row'
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
      </motion.article>
    </div>
  );
}

export function LandingRouteCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div
      ref={containerRef}
      className='mt-12 px-4 pb-[10vh] md:mt-14 md:px-7 md:pb-[12vh] lg:mt-16 lg:px-30 lg:pb-[15vh]'
    >
      {LANDING_ROUTE_STEPS.map((step, index) => (
        <RouteStepCard
          key={step.routeLabel}
          routeLabel={step.routeLabel}
          title={step.title}
          description={step.description}
          imageSrc={step.imageSrc}
          imageAlt={step.imageAlt}
          imageSide={step.imageSide}
          index={index}
          totalCards={LANDING_ROUTE_STEPS.length}
          scrollProgress={scrollYProgress}
        />
      ))}
    </div>
  );
}
