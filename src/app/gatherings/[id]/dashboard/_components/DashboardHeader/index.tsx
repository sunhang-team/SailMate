'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { AvatarGroup } from '@/components/ui/AvatarGroup';
import { StudyIcon, ProjectIcon, ArrowIcon, PeriodIcon, TimeIcon, PeopleIcon, RisingIcon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { formatDateDot, getCurrentWeek, getRemainingDays } from '@/lib/formatGatheringDate';
import { gatheringQueries } from '@/api/gatherings/queries';
import { achievementQueries } from '@/api/achievements/queries';

import { StatCard } from '../StatCard';
import { GATHERING_CATEGORY_LABEL, GATHERING_TYPE_LABEL } from '@/constants/gathering';
import { useSnapCarousel } from './useSnapCarousel';

import type { StatCardProps } from '../StatCard';
import type { GatheringType } from '@/api/gatherings/types';

const TYPE_ICON: Record<GatheringType, typeof StudyIcon> = {
  STUDY: StudyIcon,
  PROJECT: ProjectIcon,
};

interface DashboardHeaderProps {
  gatheringId: number;
}

/** 모바일: 1개씩 → 페이지 4개 / 태블릿: 2개씩 → 페이지 2개 */
const MOBILE_PAGES = 4;
const TABLET_PAGES = 2;

export function DashboardHeader({ gatheringId }: DashboardHeaderProps) {
  const { data: gathering } = useSuspenseQuery(gatheringQueries.detail(gatheringId));
  const { data: achievements } = useSuspenseQuery(achievementQueries.detail(gatheringId));

  const isMd = useMediaQuery('(min-width: 768px)');
  const pageCount = isMd ? TABLET_PAGES : MOBILE_PAGES;
  const { scrollRef, activeIndex, scrollToPage } = useSnapCarousel({ pageCount });

  const TypeIcon = TYPE_ICON[gathering.type] || StudyIcon;

  const currentWeek = getCurrentWeek(gathering.startDate);
  const daysRemaining = getRemainingDays(gathering.endDate);

  const avatars = gathering.members.map((member) => ({
    id: member.userId,
    imageUrl: member.profileImage,
  }));

  const cards: StatCardProps[] = [
    {
      icon: <PeriodIcon size={24} className='lg:h-8 lg:w-8' />,
      label: '활동기간',
      value: `${gathering.totalWeeks}주`,
      subInfo: `${formatDateDot(gathering.startDate)} ~ ${formatDateDot(gathering.endDate)}`,
    },
    {
      icon: <TimeIcon size={24} className='lg:h-8 lg:w-8' />,
      label: '진행차수',
      value: `${currentWeek}주차`,
      subInfo: `${daysRemaining}일 남음`,
    },
    {
      icon: <PeopleIcon size={24} className='lg:h-8 lg:w-8' />,
      label: '모임 구성원',
      value: `${gathering.members.length}명`,
      subInfo: <AvatarGroup avatars={avatars} max={5} size='sm' />,
    },
    {
      icon: <RisingIcon size={24} className='lg:h-8 lg:w-8' />,
      label: '전체 달성률',
      value: `${achievements.teamOverallRate}%`,
      subInfo: `${gathering.totalWeeks}주간 팀 달성률`,
    },
  ];

  return (
    <section className='bg-gradient-sub-200 px-4 pt-20 md:px-7 lg:pb-8 xl:px-30'>
      <div className='mx-auto max-w-[1680px]'>
        {/* 타이틀 영역 */}
        <div className='flex flex-col gap-1'>
          <p className='flex items-center gap-0.5 text-blue-500'>
            <TypeIcon size={14} className='text-blue-500' />
            <span className='text-small-01-sb'>{GATHERING_TYPE_LABEL[gathering.type] || gathering.type}</span>
            <ArrowIcon size={14} />
            <span className='text-small-01-r'>
              {GATHERING_CATEGORY_LABEL[gathering.category as keyof typeof GATHERING_CATEGORY_LABEL] ||
                gathering.category}
            </span>
          </p>
          <h1 className='text-h5-b md:text-h3-b xl:text-h2-b text-blue-500'>{gathering.title}</h1>
          <p className='text-small-02-r md:text-body-02-r text-gray-800'>{gathering.shortDescription}</p>
        </div>

        {/* 통계 카드 — PC: 4열 그리드 (스와이프 없음) */}
        <div className='mt-8 hidden lg:grid lg:grid-cols-4 lg:gap-4'>
          {cards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>

        {/* 통계 카드 — 모바일(1개씩) / 태블릿(2개씩) 스와이퍼 */}
        <div className='mt-6 lg:hidden'>
          <div ref={scrollRef} className='scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto'>
            {cards.map((card) => (
              <div key={card.label} className='min-w-[calc(100%-16px)] snap-start md:min-w-[calc(50%-8px)]'>
                <StatCard {...card} />
              </div>
            ))}
          </div>

          {/* Dot Indicator */}
          <div className='flex justify-center gap-1.5 py-4'>
            {Array.from({ length: pageCount }).map((_, index) => (
              <button
                key={index}
                type='button'
                aria-label={`${index + 1}페이지로 이동`}
                onClick={() => scrollToPage(index)}
                className={cn(
                  'h-2 w-2 rounded-full transition-colors',
                  activeIndex === index ? 'bg-blue-300' : 'bg-gray-200',
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
