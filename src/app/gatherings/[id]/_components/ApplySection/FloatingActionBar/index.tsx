'use client';

import { useState } from 'react';

import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

import { gatheringQueries } from '@/api/gatherings/queries';
import { applicationQueries } from '@/api/applications/queries';
import { getGatheringDisplayStatus } from '@/lib/gatheringStatus';
import { Button } from '@/components/ui/Button';
import { HeartIcon } from '@/components/ui/Icon';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { useOverlay } from '@/hooks/useOverlay';

import { GatheringApplyBottomSheet } from './GatheringApplyBottomSheet';

interface FloatingActionBarProps {
  gatheringId: number;
}

export function FloatingActionBar({ gatheringId }: FloatingActionBarProps) {
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

  const { isJoinable, isFinished, isFull, isDeadlinePassed } = getGatheringDisplayStatus(data);

  const isJoinableStatus = isJoinable && !hasPendingApplication;

  return (
    <>
      <div className='border-gray-150 bg-gray-0 fixed right-0 bottom-0 left-0 z-40 border-t px-5 py-4 md:px-7 md:py-6 xl:hidden'>
        <div className='mx-auto flex items-center gap-3'>
          <Button
            variant='bookmark'
            size='bookmark-lg'
            data-selected={isFavorite}
            aria-label='찜하기'
            aria-pressed={isFavorite}
            onClick={async () => {
              if (!isLoggedIn) {
                const isLoginSuccessful = await overlay.open(({ isOpen, close }) => {
                  return <AuthModal isOpen={isOpen} onClose={() => close(false)} onSuccess={() => close(true)} />;
                });
                if (!isLoginSuccessful) return;
              }
              setIsFavorite((prev) => !prev);
            }}
            className='h-13.5 md:h-18'
          >
            <HeartIcon size={24} variant={isFavorite ? 'filled' : 'outline'} />
          </Button>
          <Button
            variant='action'
            className='text-body-01-sb h-13.5 flex-1 md:h-18'
            disabled={!isJoinableStatus}
            onClick={async () => {
              if (!isLoggedIn) {
                const isLoginSuccessful = await overlay.open(({ isOpen, close }) => {
                  return <AuthModal isOpen={isOpen} onClose={() => close(false)} onSuccess={() => close(true)} />;
                });
                if (!isLoginSuccessful) return;
              }
              overlay.open(({ isOpen, close }) => (
                <GatheringApplyBottomSheet
                  gatheringId={gatheringId}
                  gatheringTitle={data.title}
                  isOpen={isOpen}
                  onClose={() => close(false)}
                />
              ));
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
        </div>
      </div>
    </>
  );
}
