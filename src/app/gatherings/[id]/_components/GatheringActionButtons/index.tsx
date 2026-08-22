'use client';

import { useRouter } from 'next/navigation';

import { useDeleteGathering } from '@/api/gatherings/queries';
import { Button } from '@/components/ui/Button';
import { useToastStore } from '@/components/ui/Toast/useToastStore';
import { useOverlay } from '@/hooks/useOverlay';

import { DeleteGatheringModal } from './DeleteGatheringModal';

import type { GatheringStatus } from '@/api/gatherings/types';

interface GatheringActionButtonsProps {
  gatheringId: number;
  gatheringStatus: GatheringStatus;
}

export function GatheringActionButtons({ gatheringId, gatheringStatus }: GatheringActionButtonsProps) {
  const router = useRouter();
  const overlay = useOverlay();
  const { showToast } = useToastStore();
  const { mutate: deleteGathering } = useDeleteGathering(gatheringId);
  const canEdit = gatheringStatus !== 'COMPLETED';
  const canDelete = gatheringStatus !== 'IN_PROGRESS';

  const handleEdit = () => {
    router.push(`/gatherings/${gatheringId}/edit`);
  };

  const handleDelete = async () => {
    const confirmed = await overlay.open(({ isOpen, close }) => (
      <DeleteGatheringModal isOpen={isOpen} onClose={() => close(false)} onConfirm={() => close(true)} />
    ));

    if (!confirmed) return;

    deleteGathering(undefined, {
      onSuccess: () => {
        showToast({ variant: 'success', title: '모임이 삭제되었습니다' });
        router.push('/main');
      },
      onError: () => {
        showToast({ variant: 'error', title: '모임 삭제에 실패했습니다' });
      },
    });
  };

  return (
    <div className='flex items-center gap-2'>
      <Button
        type='button'
        variant='mypage-edit'
        size={undefined}
        onClick={handleEdit}
        disabled={!canEdit}
        className='text-small-01-sb md:text-body-02-m border-blue-150 h-14 w-32.5 shrink-0 border bg-white text-blue-300 disabled:opacity-50'
      >
        정보 수정
      </Button>
      {canDelete && (
        <Button
          type='button'
          variant='mypage-edit'
          size={undefined}
          onClick={handleDelete}
          className='text-small-01-sb md:text-body-02-m h-14 w-32.5 shrink-0 border border-gray-200 bg-white text-gray-700'
        >
          모임 삭제
        </Button>
      )}
    </div>
  );
}
