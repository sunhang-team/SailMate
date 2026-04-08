'use client';

import { useState } from 'react';

import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

import { gatheringQueries } from '@/api/gatherings/queries';
import { applicationQueries, useCreateApplication } from '@/api/applications/queries';
import { getCurrentWeek } from '@/lib/formatGatheringDate';
import { Button } from '@/components/ui/Button';
import { GatheringCard } from '@/components/ui/GatheringCard';
import { HeartIcon, StudyIcon, ProjectIcon } from '@/components/ui/Icon';
import { Tag } from '@/components/ui/Tag';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { useFunnel } from '@/hooks/useFunnel';
import { useOverlay } from '@/hooks/useOverlay';

import { DeadlineLabel } from '../DeadlineLabel';
import { InfoAccordion } from '../InfoAccordion';
import { ParticipantsList } from '../ParticipantsList';
import { GatheringApplyForm } from '../GatheringApplyForm';
import { GatheringApplySuccess } from '../GatheringApplySuccess';

import { getGatheringDisplayStatus } from '@/lib/gatheringStatus';

import type { GatheringType } from '@/api/gatherings/types';

const TYPE_ICON: Record<GatheringType, typeof StudyIcon> = {
  스터디: StudyIcon,
  프로젝트: ProjectIcon,
};

interface GatheringInfoAsideProps {
  gatheringId: number;
}

export function GatheringInfoAside({ gatheringId }: GatheringInfoAsideProps) {
  const { isLoggedIn } = useAuth();
  const { data } = useSuspenseQuery(gatheringQueries.detail(gatheringId));
  const { data: myApplications } = useQuery({
    ...applicationQueries.myList(),
    enabled: isLoggedIn,
  });

  const hasPendingApplication =
    myApplications?.applications.some((app) => app.gathering.id === gatheringId && app.status === 'PENDING') ?? false;
  const [isFavorite, setIsFavorite] = useState(false);
  const overlay = useOverlay();
  const { Funnel, Step, setStep } = useFunnel<'DEFAULT' | 'APPLY' | 'SUCCESS'>('DEFAULT');

  const { mutate, isPending } = useCreateApplication(gatheringId, {
    onSuccess: () => {
      setStep('SUCCESS');
    },
  });

  const TypeIcon = TYPE_ICON[data.type] || StudyIcon;
  const TypeLabel = data.type;
  const CategoryLabel = data.categories.join(', ');

  const { displayLabel, tagState, isJoinable, isFull, isDeadlinePassed, isFinished } = getGatheringDisplayStatus(data);

  return (
    <div className='sticky top-[-20px]'>
      {/* 모집 상태 바 - 항상 노출 */}
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

      <Funnel>
        <Step name='APPLY'>
          <div className='border-gray-150 rounded-2xl border bg-white p-8 shadow-sm'>
            <GatheringApplyForm gatheringTitle={data.title} onSubmit={mutate} isLoading={isPending} />
          </div>
        </Step>

        <Step name='SUCCESS'>
          <div className='border-gray-150 rounded-2xl border bg-white p-8 shadow-sm'>
            <GatheringApplySuccess onClose={() => setStep('DEFAULT')} />
          </div>
        </Step>

        <Step name='DEFAULT'>
          <GatheringCard className='border-focus-100 w-full border'>
            <GatheringCard.Header className='items-center'>
              <Tag
                variant='category'
                icon={<TypeIcon size={14} className='text-blue-200' />}
                label={TypeLabel}
                sublabel={CategoryLabel}
              />
              <Button
                variant='bookmark'
                size='bookmark-sm'
                data-selected={isFavorite}
                aria-label='찜하기'
                aria-pressed={isFavorite}
                onClick={async () => {
                  if (!isLoggedIn) {
                    const isLoginSuccessful = await overlay.open(({ isOpen, close }) => (
                      <AuthModal isOpen={isOpen} onClose={() => close(false)} onSuccess={() => close(true)} />
                    ));
                    if (!isLoginSuccessful) return;
                  }
                  setIsFavorite((prev) => !prev);
                }}
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

            <Button
              variant='action'
              className={`text-body-01-sb h-13.5 flex-1 md:h-18 ${!isJoinable || hasPendingApplication ? 'bg-gray-300' : ''}`}
              disabled={!isJoinable || hasPendingApplication}
              onClick={async () => {
                if (!isLoggedIn) {
                  const isLoginSuccessful = await overlay.open(({ isOpen, close }) => (
                    <AuthModal isOpen={isOpen} onClose={() => close(false)} onSuccess={() => close(true)} />
                  ));
                  if (!isLoginSuccessful) return;
                }
                setStep('APPLY');
              }}
            >
              {(() => {
                if (isFinished) return '완료된 모임';
                if (data.status === 'IN_PROGRESS' || isDeadlinePassed) return '모집 마감';
                if (isFull) return '모집 완료';
                if (hasPendingApplication) return '참여 대기중';
                return '참여 신청하기';
              })()}
            </Button>
          </GatheringCard>
        </Step>
      </Funnel>
    </div>
  );
}
