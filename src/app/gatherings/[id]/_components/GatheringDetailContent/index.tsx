'use client';

import { useQuery } from '@tanstack/react-query';

import { gatheringQueries } from '@/api/gatherings/queries';
import { formatDateDot, formatDday } from '@/lib/formatGatheringDate';

import { GatheringDescription } from '../GatheringDescription';
import { ImageCarousel } from '../ImageCarousel';
import { InfoCard } from '../InfoCard';
import { MembersStatus } from '../MembersStatus';
import { WeeklyPlanAccordion } from '../WeeklyPlanAccordion';

interface GatheringDetailContentProps {
  gatheringId: number;
}

export function GatheringDetailContent({ gatheringId }: GatheringDetailContentProps) {
  const { data } = useQuery(gatheringQueries.detail(gatheringId));

  if (!data) return null;

  return (
    <div className='flex flex-col'>
      <section id='description' className='scroll-mt-10 xl:scroll-mt-12'>
        <GatheringDescription description={data.description} />
      </section>

      {data.images.length > 0 && (
        <section id='image-carousel' className='mt-10'>
          <ImageCarousel images={data.images} />
        </section>
      )}

      <section id='recruit-period' className='mt-15 scroll-mt-10 xl:scroll-mt-12'>
        <InfoCard title='모집 기간 📌'>
          <span className='text-body-02-m xl:text-body-01-m text-gray-800'>
            ~ {formatDateDot(data.recruitDeadline)} ({formatDday(data.recruitDeadline)})
          </span>
        </InfoCard>
      </section>

      <section id='activity-period' className='mt-15 scroll-mt-10 xl:scroll-mt-12'>
        <InfoCard title='활동 기간 🗓️'>
          <span className='text-body-02-m xl:text-body-01-m text-gray-800'>
            {formatDateDot(data.startDate)} ~ {formatDateDot(data.endDate)} ({data.totalWeeks}주)
          </span>
        </InfoCard>
      </section>

      <section id='goal' className='mt-15 scroll-mt-10 xl:scroll-mt-12'>
        <InfoCard title='모임 최종 목표 🔥'>
          <span className='text-body-02-m xl:text-body-01-m text-gray-800'>{data.goal}</span>
        </InfoCard>
      </section>

      {data.weeklyPlans.length > 0 && (
        <section id='weekly-plans' className='mt-15 scroll-mt-10 xl:scroll-mt-12'>
          <div className='flex flex-col gap-4 xl:gap-6'>
            <h2 className='text-body-01-sb xl:text-h5-sb text-gray-900'>주차별 계획 ✅</h2>
            <WeeklyPlanAccordion weeklyPlans={data.weeklyPlans} />
          </div>
        </section>
      )}

      <section id='members' className='mt-15 scroll-mt-10 xl:scroll-mt-12'>
        <div className='flex flex-col gap-6'>
          <h2 className='text-body-01-sb xl:text-h5-sb text-gray-900'>모집 인원 현황 👀</h2>
          <MembersStatus currentMembers={data.currentMembers} maxMembers={data.maxMembers} />
        </div>
      </section>
    </div>
  );
}
