'use client';

import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToastStore } from '@/components/ui/Toast/useToastStore';
import { useDeleteGatheringDraft } from '@/api/gatherings/queries';
import { useOverlay } from '@/hooks/useOverlay';

import { DeleteDraftModal } from './DeleteDraftModal';

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
      <div className='flex flex-col gap-1'>
        <span className='text-small-02-r md:text-body-02-r text-gray-500'>{draft.type ?? '유형 미정'}</span>
        <p className='text-body-02-b md:text-body-01-b truncate text-gray-900'>{draft.title ?? '제목 없음'}</p>
        <span className='text-small-02-r md:text-small-01-r text-gray-400'>
          {formatDistanceToNow(new Date(draft.updatedAt), { addSuffix: true, locale: ko })} 저장됨
        </span>
      </div>

      <div className='flex gap-2'>
        <Button
          variant='reject'
          size='approve-reject'
          onClick={handleDelete}
          className='text-small-01-sb md:text-body-01-sb h-12 flex-1 md:h-14'
        >
          삭제
        </Button>
        <Button
          variant='action'
          size='approve-reject'
          onClick={() => router.push(`/gatherings/new?draftId=${draft.draftId}`)}
          className='text-small-01-sb md:text-body-01-sb h-12 flex-1 md:h-14'
        >
          이어쓰기
        </Button>
      </div>
    </Card>
  );
}
