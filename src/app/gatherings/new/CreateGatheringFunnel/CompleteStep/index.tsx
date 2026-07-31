'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CheckIcon } from '@/components/ui/Icon/CheckIcon';

interface CompleteStepProps {
  gatheringId: number | null;
  onAddDetail: () => void;
}

export function CompleteStep({ gatheringId, onAddDetail }: CompleteStepProps) {
  const router = useRouter();

  return (
    <div className='flex flex-col gap-10 md:gap-14 lg:gap-10'>
      <Card className='hover:shadow-02 shadow-02 flex flex-col items-center gap-10 border-none px-8 py-20 text-center'>
        <div className='bg-gradient-primary flex size-20 items-center justify-center rounded-full md:size-25'>
          <CheckIcon className='size-20 text-white md:size-25' />
        </div>

        <div className='flex flex-col gap-2'>
          <p className='text-h5-b md:text-h3-b text-gray-900'>모임 생성이 완료되었어요!</p>
          <p className='text-small-01-r md:text-body-01-r text-gray-500'>
            이미지와 상세 설명을 추가하면 참여자가 모임을 더 쉽게 이해할 수 있습니다.
          </p>
        </div>

        <div className='flex gap-5'>
          <Button
            type='button'
            variant='mypage-edit'
            size={undefined}
            onClick={() => router.push('/main')}
            className='text-small-01-sb md:text-body-01-sb lg:text-h5-sb bg-gray-150 h-12 w-36.75 border-gray-400 text-gray-700 md:h-18 md:w-76 lg:h-20 lg:w-75'
          >
            나중에 하기
          </Button>
          <Button
            type='button'
            variant='action'
            size='action-sm'
            onClick={onAddDetail}
            className='text-small-01-sb md:text-body-01-sb lg:text-h5-sb h-12 w-36.75 bg-blue-300 md:h-18 md:w-76 lg:h-20 lg:w-75'
          >
            모임 소개 추가
          </Button>
        </div>
      </Card>

      {gatheringId && (
        <div className='flex w-full justify-end'>
          <Button
            type='button'
            variant='mypage-edit'
            size={undefined}
            onClick={() => router.push(`/gatherings/${gatheringId}`)}
            className='lg:text-h5-sb md:text-body-01-sb text-small-01-sb h-12 w-35 border border-gray-400 bg-white text-gray-700 md:h-18 md:w-56.5 lg:h-20 lg:w-75'
          >
            작성 글 보러가기
          </Button>
        </div>
      )}
    </div>
  );
}
