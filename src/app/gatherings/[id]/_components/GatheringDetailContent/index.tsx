'use client';

import { useQuery } from '@tanstack/react-query';

import { gatheringQueries } from '@/api/gatherings/queries';
import { formatDateDot, formatDday } from '@/lib/formatGatheringDate';

import { GatheringDescription } from '../GatheringDescription';
import { ImageCarousel } from '../ImageCarousel';
import { InfoCard } from '../InfoCard';

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

      {/* TODO: [이슈 4] id="weekly-plans", id="members" 섹션 */}
    </div>
  );
}
