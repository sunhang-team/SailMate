'use client';

import { useQuery } from '@tanstack/react-query';

import { Tag } from '@/components/ui/Tag';
import { gatheringQueries } from '@/api/gatherings/queries';

import { InfoAccordion } from '../InfoAccordion';
import { ParticipantsList } from '../ParticipantsList';
import { DeadlineLabel } from '../DeadlineLabel';

interface GatheringInfoCardProps {
  gatheringId: number;
}

export function GatheringInfoCard({ gatheringId }: GatheringInfoCardProps) {
  const { data } = useQuery(gatheringQueries.detail(gatheringId));

  if (!data) return null;

  return (
    <section className='xl:hidden'>
      <div className='border-focus-100 mb-4 flex justify-between rounded-[8px] border bg-blue-100 px-8 py-2.5'>
        <div className='text-body-02-sb flex items-center text-blue-400'>모집중</div>
        <div className='flex items-center gap-2'>
          <span className='text-body-02-m text-gray-700'>모집 마감까지</span>
          <Tag variant='day' state='short'>
            <DeadlineLabel recruitDeadline={data.recruitDeadline} />
          </Tag>
        </div>
      </div>

      {/* 모임 정보 아코디언 */}
      <InfoAccordion data={data} className='mb-4' />

      {/* 참여자 목록 */}
      <ParticipantsList members={data.members} maxMembers={data.maxMembers} />
    </section>
  );
}
