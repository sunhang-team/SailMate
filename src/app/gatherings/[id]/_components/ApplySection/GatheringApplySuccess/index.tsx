'use client';

import { CheckIcon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';

interface GatheringApplySuccessProps {
  onClose: () => void;
}

export function GatheringApplySuccess({ onClose }: GatheringApplySuccessProps) {
  return (
    <div className='flex flex-col items-center py-10 text-center'>
      <div className='bg-gradient-primary mb-10 flex h-20 w-20 items-center justify-center rounded-full md:h-30 md:w-30'>
        <CheckIcon className='size-20 text-white md:size-30' />
      </div>

      <div className='mb-20 flex flex-col gap-2'>
        <h2 className='text-h5-b md:text-h3-b text-gray-900'>신청이 완료되었어요!</h2>
        <p className='text-small-01-r md:text-body-01-r text-gray-600'>모임장의 승인을 기다려주세요.</p>
      </div>

      <Button variant='action' className='w-full' onClick={onClose}>
        확인
      </Button>
    </div>
  );
}
