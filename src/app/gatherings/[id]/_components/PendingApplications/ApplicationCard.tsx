'use client';

import { useState } from 'react';

import { useUpdateApplicationStatus } from '@/api/applications/queries';
import { Button } from '@/components/ui/Button';
import { CheckIcon, CloseIcon, ArrowIcon } from '@/components/ui/Icon';
import { Profile } from '@/components/ui/Profile';
import { Tag } from '@/components/ui/Tag';
import { useToastStore } from '@/components/ui/Toast/useToastStore';
import { cn } from '@/lib/cn';
import { getReputationLabel } from '@/lib/getReputationLabel';
import { useOverlay } from '@/hooks/useOverlay';

import { RejectConfirmModal } from './RejectConfirmModal';

import type { ApplicationDetail } from '@/api/applications/types';

interface ApplicationCardProps {
  gatheringId: number;
  application: ApplicationDetail;
}

export function ApplicationCard({ gatheringId, application }: ApplicationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { showToast } = useToastStore();
  const overlay = useOverlay();

  const { mutate, isPending } = useUpdateApplicationStatus(gatheringId, application.id);

  const handleApprove = () => {
    mutate(
      { status: 'ACCEPTED' },
      {
        onSuccess: () => {
          showToast({ variant: 'success', title: '승인되었습니다' });
        },
      },
    );
  };

  const handleReject = async () => {
    const confirmed = await overlay.open(({ isOpen, close }) => (
      <RejectConfirmModal isOpen={isOpen} onClose={() => close(false)} onConfirm={() => close(true)} />
    ));

    if (!confirmed) return;

    mutate(
      { status: 'REJECTED' },
      {
        onSuccess: () => {
          showToast({ variant: 'success', title: '거부되었습니다' });
        },
      },
    );
  };

  const { applicant, personalGoal, selfIntroduction } = application;

  return (
    <div className={cn('rounded-lg border bg-white', isExpanded ? 'border-gray-200' : 'border-gray-150')}>
      <div className='px-4 py-4 md:px-7'>
        {/* 프로필 헤더 */}
        <button
          type='button'
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
          aria-label={`${applicant.nickname} 상세 정보`}
          className='flex w-full items-center justify-between'
        >
          <div className='flex items-center gap-2 md:gap-4'>
            <Profile imageUrl={applicant.profileImage} className='size-8 rounded-lg md:size-12' />
            <span className='text-small-01-m md:text-body-01-m text-gray-900'>{applicant.nickname}</span>
          </div>
          <div className='flex items-center gap-2 md:gap-4'>
            <div className='flex items-center gap-2 md:gap-4'>
              <Tag variant='mate'>{getReputationLabel(applicant.reputationScore)}</Tag>
              <div className='flex items-center gap-2'>
                <span className='text-small-01-r md:text-body-01-r text-gray-900'>활동 에너지</span>
                <span className='text-small-01-sb md:text-body-01-sb text-blue-300'>{applicant.reputationScore}점</span>
              </div>
            </div>
            <ArrowIcon
              size={24}
              className={cn('text-gray-700 transition-transform md:size-8', isExpanded ? '-rotate-90' : 'rotate-90')}
            />
          </div>
        </button>

        {/* 확장 영역 */}
        {isExpanded && (
          <div className='mt-5 flex flex-col items-end gap-5'>
            {/* 목표 + 한 줄 소개 */}
            <div className='w-full rounded-lg bg-gray-100 p-7'>
              <div className='flex flex-col gap-7'>
                <div className='flex flex-col gap-2'>
                  <span className='text-small-01-sb md:text-body-01-sb text-gray-900'>목표</span>
                  <p className='text-small-02-r md:text-body-01-r text-gray-700'>{personalGoal}</p>
                </div>
                {selfIntroduction && (
                  <>
                    <hr className='border-gray-150' />
                    <div className='flex flex-col gap-2'>
                      <span className='text-small-01-sb md:text-body-01-sb text-gray-900'>한 줄 소개</span>
                      <p className='text-small-02-r md:text-body-01-r text-gray-700'>{selfIntroduction}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 승인/거부 버튼 */}
            <div className='flex items-center gap-2 md:gap-4'>
              <Button variant='approve' size='approve-reject' onClick={handleApprove} disabled={isPending}>
                <CheckIcon size={32} />
                승인
              </Button>
              <Button variant='reject' size='approve-reject' onClick={handleReject} disabled={isPending}>
                <CloseIcon size={32} />
                거부
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
