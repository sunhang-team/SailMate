'use client';

import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/Button';
import { GatheringCard } from '@/components/ui/GatheringCard';
import { HeartIcon, StudyIcon, ProjectIcon, PersonIcon } from '@/components/ui/Icon';
import { Tag } from '@/components/ui/Tag';
import { gatheringQueries } from '@/api/gatherings/queries';

import { DeadlineLabel } from '../DeadlineLabel';
import { InfoAccordion } from '../InfoAccordion';
import { ParticipantsList } from '../ParticipantsList';

import type { GatheringType } from '@/api/gatherings/types';

const TYPE_ICON: Record<GatheringType, typeof StudyIcon> = {
  스터디: StudyIcon,
  프로젝트: ProjectIcon,
};

interface GatheringInfoAsideProps {
  gatheringId: number;
}

export function GatheringInfoAside({ gatheringId }: GatheringInfoAsideProps) {
  const { data } = useQuery(gatheringQueries.detail(gatheringId));
  const [isFavorite, setIsFavorite] = useState(false);

  if (!data) return null;

  const TypeIcon = TYPE_ICON[data.type];

  return (
    <div className='sticky top-24'>
      <div className='border-focus-100 mt-15 mb-4 flex justify-between rounded-[8px] border bg-blue-100 px-8 py-2.5'>
        <div className='text-body-02-sb flex items-center text-blue-400'>모집중</div>
        <div className='flex items-center gap-2'>
          <span className='text-body-02-m text-gray-700'>모집 마감까지</span>
          <Tag variant='day' state='short'>
            <DeadlineLabel recruitDeadline={data.recruitDeadline} />
          </Tag>
        </div>
      </div>
      <GatheringCard className='border-focus-100 w-full border'>
        <GatheringCard.Header className='items-center'>
          <Tag
            variant='category'
            icon={<TypeIcon size={14} className='text-blue-200' />}
            label={data.type}
            sublabel={data.category}
          />
          <Button
            variant='bookmark'
            size='bookmark-sm'
            data-selected={isFavorite}
            aria-label='찜하기'
            aria-pressed={isFavorite}
            onClick={() => setIsFavorite((prev) => !prev)}
          >
            <HeartIcon size={20} variant={isFavorite ? 'filled' : 'outline'} />
          </Button>
        </GatheringCard.Header>

        <GatheringCard.Body className='mb-10 gap-2'>
          <div className='flex flex-wrap gap-1'>
            {data.tags.map((tag) => (
              <span key={tag} className='text-body-02-r text-gray-700'>
                #{tag}
              </span>
            ))}
          </div>
          <p className='text-body-01-b text-gray-900'>{data.title}</p>
          <p className='text-small-01-r text-gray-800'>{data.shortDescription}</p>
        </GatheringCard.Body>

        <GatheringCard.Footer className='flex-col'>
          <InfoAccordion data={data} className='mb-7' />
          <ParticipantsList members={data.members} maxMembers={data.maxMembers} className='mb-7' />
        </GatheringCard.Footer>

        <Button variant='action' className='text-h5-b h-16 w-full'>
          참여 신청하기
        </Button>
      </GatheringCard>
    </div>
  );
}
