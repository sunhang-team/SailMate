'use client';

import { useRouter } from 'next/navigation';

import { useDeleteGathering } from '@/api/gatherings/queries';
import { Dropdown } from '@/components/ui/Dropdown';
import { MoreIcon } from '@/components/ui/Icon';
import { useToastStore } from '@/components/ui/Toast/useToastStore';
import { useOverlay } from '@/hooks/useOverlay';

import { DeleteGatheringModal } from './DeleteGatheringModal';

interface LeaderActionDropdownProps {
  gatheringId: number;
}

export function LeaderActionDropdown({ gatheringId }: LeaderActionDropdownProps) {
  const router = useRouter();
  const overlay = useOverlay();
  const { showToast } = useToastStore();
  const { mutate: deleteGathering } = useDeleteGathering(gatheringId);

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
    <Dropdown>
      <Dropdown.Trigger>
        <MoreIcon size={32} className='text-blue-500' />
      </Dropdown.Trigger>
      <Dropdown.Menu
        containerClassName='right-0'
        className='flex w-20 flex-col gap-3 px-3 py-2 shadow-[0px_0px_12px_0px_rgba(30,88,248,0.04)]'
      >
        <Dropdown.Item onClick={handleEdit} className='text-body-02-r cursor-pointer text-gray-500 hover:text-blue-300'>
          수정
        </Dropdown.Item>
        <Dropdown.Item
          onClick={handleDelete}
          className='text-body-02-m cursor-pointer text-gray-900 hover:text-blue-300'
        >
          삭제
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
