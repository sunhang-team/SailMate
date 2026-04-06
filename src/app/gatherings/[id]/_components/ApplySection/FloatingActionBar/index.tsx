'use client';

import { useState } from 'react';

import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

import { gatheringQueries } from '@/api/gatherings/queries';
import { applicationQueries, useCreateApplication } from '@/api/applications/queries';
import { Button } from '@/components/ui/Button';
import { HeartIcon } from '@/components/ui/Icon';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { useFunnel } from '@/hooks/useFunnel';

import { GatheringApplyForm } from '../GatheringApplyForm';
import { GatheringApplySuccess } from '../GatheringApplySuccess';
import { useOverlay } from '@/hooks/useOverlay';

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
  const [isOpen, setIsOpen] = useState(false);
  const overlay = useOverlay();
  const { Funnel, Step, setStep, currentStep } = useFunnel<'APPLY' | 'SUCCESS'>('APPLY');

  const { mutate, isPending } = useCreateApplication(gatheringId, {
    onSuccess: () => {
      setStep('SUCCESS');
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    setStep('APPLY');
  };

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
            className={`text-body-01-sb h-13.5 flex-1 md:h-18 ${hasPendingApplication ? 'bg-gray-300' : ''}`}
            disabled={hasPendingApplication}
            onClick={async () => {
              if (!isLoggedIn) {
                const isLoginSuccessful = await overlay.open(({ isOpen, close }) => {
                  return <AuthModal isOpen={isOpen} onClose={() => close(false)} onSuccess={() => close(true)} />;
                });
                if (!isLoginSuccessful) return;
              }
              setIsOpen(true);
            }}
          >
            {hasPendingApplication ? '참여 대기중' : '참여 신청하기'}
          </Button>
        </div>
      </div>

      <BottomSheet isOpen={isOpen} onClose={handleClose}>
        <BottomSheet.Header showCloseButton={currentStep === 'APPLY'}>{null}</BottomSheet.Header>
        <BottomSheet.Body className='scrollbar-none pb-10'>
          <Funnel>
            <Step name='APPLY'>
              <GatheringApplyForm gatheringTitle={data.title} onSubmit={mutate} isLoading={isPending} />
            </Step>
            <Step name='SUCCESS'>
              <GatheringApplySuccess onClose={handleClose} />
            </Step>
          </Funnel>
        </BottomSheet.Body>
      </BottomSheet>
    </>
  );
}
