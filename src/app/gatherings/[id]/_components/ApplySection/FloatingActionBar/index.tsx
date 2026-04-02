'use client';

import { useState } from 'react';
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';

import { gatheringQueries, gatheringKeys } from '@/api/gatherings/queries';
import { useCreateApplication } from '@/api/applications/queries';
import { Button } from '@/components/ui/Button';
import { HeartIcon } from '@/components/ui/Icon';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { GatheringApplyForm } from '../GatheringApplyForm';
import { GatheringApplySuccess } from '../GatheringApplySuccess';

interface FloatingActionBarProps {
  gatheringId: number;
}

export function FloatingActionBar({ gatheringId }: FloatingActionBarProps) {
  const { data } = useSuspenseQuery(gatheringQueries.detail(gatheringId));
  const [isFavorite, setIsFavorite] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'APPLY' | 'SUCCESS'>('APPLY');

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
            onClick={() => setIsFavorite((prev) => !prev)}
            className='h-13.5 md:h-18'
          >
            <HeartIcon size={24} variant={isFavorite ? 'filled' : 'outline'} />
          </Button>
          <Button
            variant='action'
            className={`text-body-01-sb h-13.5 flex-1 md:h-18 ${data.myApplicationStatus === 'PENDING' ? 'bg-gray-300' : ''}`}
            disabled={data.myApplicationStatus === 'PENDING'}
            onClick={() => setIsOpen(true)}
          >
            {data.myApplicationStatus === 'PENDING' ? '참여 대기중' : '참여 신청하기'}
          </Button>
        </div>
      </div>

      <BottomSheet isOpen={isOpen} onClose={handleClose}>
        <BottomSheet.Header showCloseButton={step === 'APPLY'}>{null}</BottomSheet.Header>
        <BottomSheet.Body className='scrollbar-none pb-10'>
          {step === 'APPLY' ? (
            <GatheringApplyForm gatheringTitle={data.title} onSubmit={mutate} isLoading={isPending} />
          ) : (
            <GatheringApplySuccess onClose={handleClose} />
          )}
        </BottomSheet.Body>
      </BottomSheet>
    </>
  );
}
