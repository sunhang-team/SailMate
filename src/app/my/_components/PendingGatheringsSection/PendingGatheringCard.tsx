'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { GatheringCard } from '@/components/ui/GatheringCard';
import { CalendarIcon, PersonIcon, ProjectIcon, StudyIcon } from '@/components/ui/Icon';
import { Modal } from '@/components/ui/Modal';
import { Tag } from '@/components/ui/Tag';
import { useDeleteApplication } from '@/api/applications/queries';

import type { MyApplication } from '@/api/applications/types';
import type { GatheringDetail } from '@/api/gatherings/types';

interface PendingGatheringCardProps {
  application: MyApplication;
  gathering: GatheringDetail;
}

const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;

const formatDate = (isoDate: string) => isoDate.slice(0, 10);

const TYPE_ICON = {
  스터디: StudyIcon,
  프로젝트: ProjectIcon,
} as const;

const toDeadlineDdayLabel = (recruitDeadline: string) => {
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const deadline = new Date(recruitDeadline);
  if (Number.isNaN(deadline.getTime())) {
    return `모집 마감 ${formatDate(recruitDeadline)}`;
  }
  const deadlineMidnight = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());
  const diffDays = Math.ceil((deadlineMidnight.getTime() - todayMidnight.getTime()) / MILLISECONDS_IN_A_DAY);

  return `모집 마감 D-${Math.max(0, diffDays)}`;
};

const toWeeksLabel = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays = Math.max(0, Math.ceil((end.getTime() - start.getTime()) / MILLISECONDS_IN_A_DAY));
  const weeks = Math.max(1, Math.ceil(diffDays / 7));
  return `${weeks}주`;
};

export function PendingGatheringCard({ application, gathering }: PendingGatheringCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const gatheringId = application.gathering.id;
  const applicationId = application.id;

  const { mutate, isPending } = useDeleteApplication(gatheringId, applicationId, {
    onSuccess: () => {
      setIsModalOpen(false);
    },
  });

  const totalWeeksLabel = toWeeksLabel(gathering.startDate, gathering.endDate);
  const dateRangeLabel = `${formatDate(gathering.startDate)} ~ ${formatDate(gathering.endDate)}`;
  const hashtagLabel = gathering.tags.map((t) => `#${t}`).join(' ');

  return (
    <>
      <GatheringCard className='shadow-01 w-full'>
        <GatheringCard.Header className='items-center'>
          <Tag
            variant='category'
            icon={(() => {
              const Icon = TYPE_ICON[gathering.type as keyof typeof TYPE_ICON] || ProjectIcon;
              return <Icon size={14} className='text-blue-300' />;
            })()}
            label={gathering.type}
            sublabel={gathering.categories.join(', ')}
          />
        </GatheringCard.Header>
        <GatheringCard.Body className='gap-0'>
          {hashtagLabel.length > 0 && <p className='text-small-02-r text-gray-500'>{hashtagLabel}</p>}
          <p className='text-body-01-b text-gray-900'>{gathering.title}</p>

          <div className='text-small-01-r mt-2 flex flex-wrap items-center gap-2 text-gray-600'>
            <div className='flex items-center gap-1.5'>
              <CalendarIcon size={16} className='text-gray-600' />
              <span>{dateRangeLabel}</span>
            </div>
            <div className='flex items-center gap-1.5'>
              <span>・ {totalWeeksLabel}</span>
            </div>
            <div className='flex items-center gap-2'>
              <PersonIcon size={16} className='text-gray-600' />
              <span>
                {gathering.currentMembers}
                <span className='text-gray-400'>/{gathering.maxMembers}</span>
              </span>
            </div>
          </div>
        </GatheringCard.Body>
        <GatheringCard.Footer className='mt-4 items-center gap-2'>
          <Button
            variant='cancel'
            size='cancel'
            className='w-full'
            type='button'
            onClick={() => setIsModalOpen(true)}
            disabled={isPending}
          >
            {isPending ? '처리 중…' : '참여 취소하기'}
          </Button>
        </GatheringCard.Footer>
      </GatheringCard>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>
          <h2 className='text-body-01-b text-gray-900'>참여 신청을 취소할까요?</h2>
        </Modal.Header>
        <Modal.Body>
          <p className='text-body-02-r text-gray-600'>
            취소하면 이 모임의 대기 목록에서 제거되며, 다시 참여하려면 신청해야 합니다.
          </p>
        </Modal.Body>
        <Modal.Footer className='flex flex-wrap justify-end gap-2'>
          <Button
            variant='cancel'
            size='login-sm'
            type='button'
            className='w-auto min-w-20 px-4'
            onClick={() => setIsModalOpen(false)}
            disabled={isPending}
          >
            닫기
          </Button>
          <Button
            variant='participation'
            size='participation-sm'
            type='button'
            className='w-auto max-w-full min-w-24 px-5'
            disabled={isPending}
            onClick={() => mutate()}
          >
            {isPending ? '처리 중…' : '취소하기'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
