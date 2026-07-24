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
    <Card className='flex flex-col items-center gap-6 px-8 py-20 text-center shadow-none'>
      <div className='bg-gradient-primary flex size-20 items-center justify-center rounded-full'>
        <CheckIcon className='size-10 text-white' />
      </div>

      <div className='flex flex-col gap-2'>
        <p className='text-h5-b md:text-h4-b text-gray-900'>모임 생성이 완료되었어요!</p>
        <p className='text-small-01-r md:text-body-01-r text-gray-500'>
          이미지와 상세 설명을 추가하면 참여자가 모임을 더 쉽게 이해할 수 있습니다.
        </p>
      </div>

      <div className='flex gap-3'>
        <Button
          type='button'
          variant='mypage-edit'
          size={undefined}
          onClick={() => router.push('/main')}
          className='text-small-01-sb md:text-body-01-sb lg:text-h5-sb h-12 w-[164px] md:h-[72px] md:w-75 lg:h-20'
        >
          나중에 하기
        </Button>
        <Button
          type='button'
          variant='action'
          size='action-sm'
          onClick={onAddDetail}
          className='text-small-01-sb md:text-body-01-sb lg:text-h5-sb h-12 w-[164px] md:h-[72px] md:w-75 lg:h-20'
        >
          모임 소개 추가
        </Button>
      </div>

      {gatheringId && (
        <Button
          type='button'
          variant='mypage-edit'
          size={undefined}
          onClick={() => router.push(`/gatherings/${gatheringId}`)}
          className='text-small-02-m md:text-body-02-m self-end'
        >
          작성 글 보러가기
        </Button>
      )}
    </Card>
  );
}
