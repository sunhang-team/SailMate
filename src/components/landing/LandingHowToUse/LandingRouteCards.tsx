'use client';

import Image from 'next/image';
import { forwardRef, useRef, useEffect } from 'react';
import { motion, useTransform, useReducedMotion, type MotionValue } from 'motion/react';

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

interface LandingRouteCardsProps {
  scrollYProgress: MotionValue<number>;
}
/**
 * 1920: 이미지 800×488에 맞춘 시안 패딩.
 * xl(1280)~1920 구간: 이미지가 줄어드는 만큼 패딩도 같이 줄어들어 "찌그러짐" 방지.
 * (패딩은 요소 폭/뷰포트 변화에 연속적으로 반응하도록 clamp+calc로 선형 보간)
 */
const ROUTE_TEXT_PADDING_XL: Record<RouteLabel, string> = {
  // 1280→1920: pt/pb 96→138, pl 40→100, pr는 route별로 min→max
  'Route 1':
    'xl:pt-[clamp(96px,calc(96px+42*(100vw-1280px)/640),138px)] xl:pb-[clamp(96px,calc(96px+43*(100vw-1280px)/640),139px)] xl:pl-[clamp(40px,calc(40px+60*(100vw-1280px)/640),100px)] xl:pr-[clamp(120px,calc(120px+110*(100vw-1280px)/640),230px)]',
  'Route 2':
    'xl:pt-[clamp(96px,calc(96px+42*(100vw-1280px)/640),138px)] xl:pb-[clamp(96px,calc(96px+43*(100vw-1280px)/640),139px)] xl:pl-[clamp(32px,calc(32px+48*(100vw-1280px)/640),80px)] xl:pr-[clamp(104px,calc(104px+88*(100vw-1280px)/640),192px)]',
  'Route 3':
    'xl:pt-[clamp(96px,calc(96px+42*(100vw-1280px)/640),138px)] xl:pb-[clamp(96px,calc(96px+43*(100vw-1280px)/640),139px)] xl:pl-[clamp(40px,calc(40px+60*(100vw-1280px)/640),100px)] xl:pr-[clamp(112px,calc(112px+103*(100vw-1280px)/640),215px)]',
  'Route 4':
    'xl:pt-[clamp(96px,calc(96px+42*(100vw-1280px)/640),138px)] xl:pb-[clamp(96px,calc(96px+43*(100vw-1280px)/640),139px)] xl:pl-[clamp(32px,calc(32px+48*(100vw-1280px)/640),80px)] xl:pr-[clamp(136px,calc(136px+119*(100vw-1280px)/640),255px)]',
};

const ROUTE_IMAGE_PADDING_XL: Record<RouteLabel, string> = {
  'Route 1': 'xl:pt-[60px] xl:pb-[60px] xl:pl-0 xl:pr-[100px]',
  'Route 3': 'xl:pt-[60px] xl:pb-[60px] xl:pl-0 xl:pr-[100px]',
  'Route 2': 'xl:pt-[60px] xl:pb-[60px] xl:pl-[100px] xl:pr-0',
  'Route 4': 'xl:pt-[60px] xl:pb-[60px] xl:pl-[100px] xl:pr-0',
};

/** 시안 기준 800×488 (Next/Image 종횡비·CLS). 고해상도 PNG는 동일 비율이면 이 값 그대로 사용 가능 */
const ROUTE_STEP_IMAGE_WIDTH = 800;
const ROUTE_STEP_IMAGE_HEIGHT = 488;

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

  const transitionEnd = (index + 1) / totalCards;
  const transitionStart = transitionEnd - TRANSITION_WINDOW_RATIO;
  const scale = useTransform(scrollProgress, [transitionStart, transitionEnd], [1, isLast ? 1 : MIN_SCALE]);

  const meta = ROUTE_META[routeLabel];
  const enableScrollEffects = !shouldReduceMotion;

  const textBlock = (
    <div
      className={cn(
        'flex flex-col items-center justify-center bg-gray-100 px-4 pt-8 pb-10 text-center md:px-29 md:py-15 xl:w-[46.3%] xl:min-w-0 xl:items-start xl:text-left',
        ROUTE_TEXT_PADDING_XL[routeLabel],
      )}
    >
      <Tag variant='route'>{routeLabel}</Tag>
      <h3 className='text-body-01-b md:text-h4-b xl:text-h3-b mt-6 mb-2 break-keep text-gray-900'>{title}</h3>
      <p className='text-small-02-r md:text-body-02-r xl:text-body-01-r break-keep text-gray-800'>{description}</p>
      <div className='mt-10 flex flex-wrap items-center justify-center gap-8 md:mt-15 xl:mt-25 xl:justify-start'>
        {meta.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className='flex items-center gap-3 text-gray-700'>
              <Icon size={44} className='shrink-0' />
              <span className='text-small-02-sb md:text-body-02-sb xl:text-body-01-sb'>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const imageBlock = (
    <div
      className={cn(
        /** xl: 800×488 이미지 + 시안 한쪽 100px 패딩 = 열 너비 900px (48%면 좁은 화면에서 800 미만으로 줄어듦) */
        'flex items-center justify-center bg-gray-100 p-4 md:p-7 xl:w-[53.7%] xl:min-w-0',
        ROUTE_IMAGE_PADDING_XL[routeLabel],
      )}
    >
      <div className='aspect-[800/488] w-full max-w-[800px]'>
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={ROUTE_STEP_IMAGE_WIDTH}
          height={ROUTE_STEP_IMAGE_HEIGHT}
          className='size-full object-contain'
          sizes='(max-width: 800px) 100vw, 800px'
        />
      </div>
    </div>
  );

  return (
    <div
      // 💡 3. 타이틀 바로 밑에 쌓이도록 top 위치 지정
      className={cn('sticky top-60', !isFirst && 'mt-[40vh] md:mt-[55vh] xl:mt-[80vh]')}
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

export function LandingRouteCards({ scrollYProgress }: LandingRouteCardsProps) {
  return (
    <div className='relative px-4 pt-15 pb-[10vh] md:px-7 md:pt-20 md:pb-[12vh] xl:px-30'>
      {LANDING_ROUTE_STEPS.map((step, index) => (
        <RouteStepCard
          key={step.routeLabel}
          {...step}
          index={index}
          totalCards={LANDING_ROUTE_STEPS.length}
          scrollProgress={scrollYProgress}
        />
      ))}
    </div>
  );
}
