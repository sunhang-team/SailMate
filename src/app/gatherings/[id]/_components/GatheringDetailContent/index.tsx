'use client';

import { useQuery } from '@tanstack/react-query';

import { gatheringQueries } from '@/api/gatherings/queries';
import { cn } from '@/lib/cn';
import { formatDateDot, formatDday } from '@/lib/formatGatheringDate';
import { useAuth } from '@/hooks/useAuth';

import { GatheringDescription } from '../GatheringDescription';
import { ImageCarousel } from '../ImageCarousel';
import { InfoCard } from '../InfoCard';
import { MembersStatus } from '../MembersStatus';
import { WeeklyPlanAccordion } from '../WeeklyPlanAccordion';

interface GatheringDetailContentProps {
  gatheringId: number;
}

export function GatheringDetailContent({ gatheringId }: GatheringDetailContentProps) {
  const { user } = useAuth();
  const { data } = useQuery(gatheringQueries.detail(gatheringId));

  if (!data) return null;

  const isLeader = data.members.some((m) => m.userId === user?.id && m.role === 'LEADER');

  return (
    <div className='flex flex-col'>
      {isLeader && (
        <section id='pending-applications' className='scroll-mt-10 xl:scroll-mt-12'>
          <div className='flex flex-col gap-4'>
            <h2 className='text-body-01-sb xl:text-h5-sb text-gray-900'>신청 대기자 👑</h2>
            <div className='border-gray-150 rounded-lg border bg-gray-50 px-4 py-6'>
              <p className='text-body-02-r text-gray-500'>신청 대기자 관리 기능은 준비 중입니다</p>
            </div>
          </div>
        </section>
      )}

      <section id='description' className={cn('scroll-mt-10 xl:scroll-mt-12', isLeader && 'mt-15')}>
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
