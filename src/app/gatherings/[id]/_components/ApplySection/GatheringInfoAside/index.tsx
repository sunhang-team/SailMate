'use client';

import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';

import { gatheringQueries } from '@/api/gatherings/queries';
import { useLikeToggle } from '@/api/likes/hooks';
import { applicationQueries, useCreateApplication } from '@/api/applications/queries';
import { getCurrentWeek } from '@/lib/formatGatheringDate';
import { Button } from '@/components/ui/Button';
import { HeartIcon, StudyIcon, ProjectIcon } from '@/components/ui/Icon';
import { Tag } from '@/components/ui/Tag';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { useFunnel } from '@/hooks/useFunnel';
import { useOverlay } from '@/hooks/useOverlay';
import { useToastStore } from '@/components/ui/Toast/useToastStore';

import { DeadlineLabel } from '../DeadlineLabel';
import { InfoAccordion } from '../InfoAccordion';
import { ParticipantsList } from '../ParticipantsList';
import { GatheringApplyForm } from '../GatheringApplyForm';
import { GatheringApplySuccess } from '../GatheringApplySuccess';

import { getGatheringDisplayStatus, getJoinButtonText } from '@/lib/gatheringStatus';

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
  const { isLiked, isPending: isLikePending, toggleLike } = useLikeToggle(gatheringId);
  const overlay = useOverlay();
  const { showToast } = useToastStore();
  const { Funnel, Step, setStep } = useFunnel<'DEFAULT' | 'APPLY' | 'SUCCESS'>('DEFAULT');

  const { mutate, isPending } = useCreateApplication(gatheringId, {
    onSuccess: () => {
      setStep('SUCCESS');
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        showToast({ variant: 'error', title: error.response.data.message });
        return;
      }
      showToast({ variant: 'error', title: '신청에 실패했습니다.' });
    },
  });

  const TypeIcon = TYPE_ICON[data.type] || StudyIcon;
  const TypeLabel = data.type;
  const CategoryLabel = data.categories.join(', ');

  const { displayLabel, tagState, isJoinable, isFull, isDeadlinePassed, isFinished } = getGatheringDisplayStatus(data);

  return (
    <div>
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
          <div className='border-focus-100 shadow-01 w-full rounded-2xl border bg-white p-8'>
            <GatheringApplyForm gatheringTitle={data.title} onSubmit={mutate} isLoading={isPending} />
          </div>
        </Step>

        <Step name='SUCCESS'>
          <div className='border-focus-100 shadow-01 w-full rounded-2xl border bg-white p-8'>
            <GatheringApplySuccess onClose={() => setStep('DEFAULT')} />
          </div>
        </Step>

        <Step name='DEFAULT'>
          <div className='border-focus-100 shadow-01 w-full rounded-2xl border bg-white p-7'>
            <div className='mb-6 flex items-center justify-between'>
              <Tag
                variant='category'
                icon={<TypeIcon size={14} className='text-blue-200' />}
                label={TypeLabel}
                sublabel={CategoryLabel}
              />
              <Button
                variant='bookmark'
                size='bookmark-sm'
                data-selected={isLiked}
                aria-label='찜하기'
                aria-pressed={isLiked}
                onClick={toggleLike}
                disabled={isLikePending}
              >
                <HeartIcon size={20} variant={isLiked ? 'filled' : 'outline'} />
              </Button>
            </div>

            <div className='mb-10 flex flex-col gap-2'>
              <div className='flex flex-wrap gap-1'>
                {data.tags.map((tag) => (
                  <span key={tag} className='text-body-02-r text-gray-700'>
                    #{tag}
                  </span>
                ))}
              </div>
              <h3 className='text-h3-b text-gray-900'>{data.title}</h3>
              <p className='text-body-02-r text-gray-800'>{data.shortDescription}</p>
            </div>

            <div className='flex flex-col'>
              <InfoAccordion data={data} className='mb-7' />
              <ParticipantsList members={data.members} maxMembers={data.maxMembers} className='mb-7' />
            </div>

            <Button
              variant='action'
              className='text-body-01-sb h-13.5 w-full md:h-18 lg:h-20'
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
              {getJoinButtonText({
                isFinished,
                isDeadlinePassed,
                isFull,
                hasPendingApplication,
                status: data.status,
              })}
            </Button>
          </div>
        </Step>
      </Funnel>
    </div>
  );
}
