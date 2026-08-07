'use client';

import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import { SuspenseBoundary } from '@/components/SuspenseBoundary';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TrashIcon } from '@/components/ui/Icon';
import { useToastStore } from '@/components/ui/Toast/useToastStore';
import { useDeleteGatheringDraft } from '@/api/gatherings/queries';
import { useOverlay } from '@/hooks/useOverlay';

import { DeleteDraftModal } from './DeleteDraftModal';
import { GatheringDraftStepTag } from './GatheringDraftStepTag';

import type { GatheringDraftSummary } from '@/api/gatherings/types';

interface GatheringDraftCardProps {
  draft: GatheringDraftSummary;
}

export function GatheringDraftCard({ draft }: GatheringDraftCardProps) {
  const router = useRouter();
  const overlay = useOverlay();
  const showToast = useToastStore((state) => state.showToast);
  const { mutate: deleteDraft } = useDeleteGatheringDraft(draft.draftId);

  const handleDelete = async () => {
    const confirmed = await overlay.open(({ isOpen, close }) => (
      <DeleteDraftModal isOpen={isOpen} onClose={() => close(false)} onConfirm={() => close(true)} />
    ));

    if (!confirmed) return;

    deleteDraft(undefined, {
      onSuccess: () => showToast({ variant: 'success', title: '임시저장이 삭제되었습니다.' }),
      onError: () => showToast({ variant: 'error', title: '임시저장 삭제에 실패했습니다.' }),
    });
  };

  return (
    <Card className='flex flex-col gap-4 p-6'>
      <div className='flex items-start justify-between'>
        <SuspenseBoundary
          pendingFallback={<div className='bg-gray-150 h-6.5 w-24 animate-pulse rounded-full' />}
          errorFallback={null}
        >
          <GatheringDraftStepTag draftId={draft.draftId} />
        </SuspenseBoundary>
        <button
          type='button'
          aria-label='임시저장 삭제'
          onClick={handleDelete}
          className='text-gray-500 transition-colors hover:text-gray-600'
        >
          <TrashIcon size={20} />
        </button>
      </div>

      <div className='flex flex-col gap-1'>
        <p className='text-body-02-sb md:text-body-01-sb truncate text-gray-900'>
          {draft.title?.trim() ? draft.title : '제목 없음'}
        </p>
        <span className='text-small-02-r md:text-small-01-r text-gray-500'>
          마지막 저장 {format(new Date(draft.updatedAt), 'M월 d일 a h:mm', { locale: ko })}
        </span>
      </div>

      <Button
        variant='approve'
        onClick={() => router.push(`/gatherings/new?draftId=${draft.draftId}`)}
        className='text-small-01-m md:text-body-01-m h-12 w-full md:h-14'
      >
        이어서 작성
      </Button>
    </Card>
  );
}
