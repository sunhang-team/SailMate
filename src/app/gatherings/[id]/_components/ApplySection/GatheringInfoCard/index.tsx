'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { gatheringQueries } from '@/api/gatherings/queries';
import { Tag } from '@/components/ui/Tag';
import { getGatheringDisplayStatus } from '@/lib/gatheringStatus';
import { getCurrentWeek } from '@/lib/formatGatheringDate';
import { InfoAccordion } from '../InfoAccordion';
import { ParticipantsList } from '../ParticipantsList';
import { DeadlineLabel } from '../DeadlineLabel';

interface GatheringInfoCardProps {
  gatheringId: number;
}

export function GatheringInfoCard({ gatheringId }: GatheringInfoCardProps) {
  const { data } = useSuspenseQuery(gatheringQueries.detail(gatheringId));

  const { displayLabel, tagState } = getGatheringDisplayStatus(data);

  return (
    <section className='xl:hidden'>
      {tagState === 'recruiting' && (
        <div className='border-focus-100 mb-4 flex justify-between rounded-[8px] border bg-blue-100 px-8 py-2.5'>
          <div className='text-body-02-sb flex items-center text-blue-400'>{displayLabel}</div>
          <div className='flex items-center gap-2'>
            <span className='text-body-02-m text-gray-700'>모집 마감까지</span>
            <Tag variant='day' state='short'>
              <DeadlineLabel recruitDeadline={data.recruitDeadline} />
            </Tag>
          </div>
        </div>
      )}

      {tagState === 'progressing' && (
        <div className='border-focus-100 mb-4 flex justify-between rounded-[8px] border bg-blue-100 px-8 py-2.5'>
          <div className='text-body-02-sb flex items-center text-blue-400'>{displayLabel}</div>
          <div className='flex items-center gap-2'>
            <span className='text-body-02-sb text-blue-300'>{getCurrentWeek(data.startDate)}주차</span>
            <span className='text-body-02-m text-gray-700'>진행중 (총 {data.totalWeeks}주)</span>
          </div>
        </div>
      )}

      {tagState === 'completed' && (
        <div className='border-gray-150 bg-gray-150 mb-4 flex justify-between rounded-[8px] border px-8 py-2.5'>
          <div className='text-body-02-sb flex items-center text-gray-600'>{displayLabel}</div>
          <div className='flex items-center gap-2'>
            <span className='text-body-02-m text-gray-500'>완료된 모임</span>
          </div>
        </div>
      )}

      {/* 모임 정보 아코디언 */}
      <InfoAccordion data={data} className='mb-4' />

      {/* 참여자 목록 */}
      <ParticipantsList members={data.members} maxMembers={data.maxMembers} className='mb-8' />
    </section>
  );
}
