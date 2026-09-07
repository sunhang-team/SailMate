'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';

interface GatheringIntroBannerProps {
  gatheringId: number;
}

export function GatheringIntroBanner({ gatheringId }: GatheringIntroBannerProps) {
  const router = useRouter();

  const handleAddIntro = () => {
    router.push(`/gatherings/new?gatheringId=${gatheringId}&step=DETAIL`);
  };

  return (
    <div className='flex flex-col items-start gap-4 rounded-lg bg-blue-50 p-6 xl:flex-row xl:items-center xl:justify-between'>
      <p className='text-body-02-r text-blue-300'>
        모임 소개가 아직 비어 있어요.
        <br />
        상세 설명과 이미지를 추가하면 참여자가 모임을 더 쉽게 이해할 수 있어요.
      </p>
      <Button
        type='button'
        variant='add-task'
        size={undefined}
        onClick={handleAddIntro}
        className='bg-gray-0 text-body-02-m md:text-body-02-m h-11 w-30 shrink-0 border border-blue-300'
      >
        소개 추가
      </Button>
    </div>
  );
}
