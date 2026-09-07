'use client';

import { Button } from '@/components/ui/Button';
import { ExclamationIcon } from '@/components/ui/Icon';
import { Modal } from '@/components/ui/Modal';

interface DeleteGatheringModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteGatheringModal({ isOpen, onClose, onConfirm }: DeleteGatheringModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className='max-w-[502px] rounded-2xl'>
      <div className='flex flex-col items-center gap-6 p-8'>
        {/* 경고 아이콘 */}
        <div className='flex size-25 items-center justify-center rounded-full bg-blue-100'>
          <ExclamationIcon size={32} className='text-blue-300' />
        </div>

        {/* 텍스트 */}
        <div className='flex flex-col gap-2 text-center'>
          <h2 className='text-body-02-sb md:text-h5-sb lg:text-h4-b text-gray-900'>
            모임을 <span className='text-blue-300'>삭제</span>하시겠습니까?
          </h2>
          <p className='text-small-02-r md:text-body-02-r lg:text-body-01-r text-gray-500'>
            삭제 버튼을 누르면 해당 모임은 삭제됩니다.
          </p>
        </div>

        {/* 버튼 */}
        <div className='flex w-full items-center gap-2'>
          <Button variant='reject' size='approve-reject' onClick={onClose} className='text-body-01-m h-18 flex-1'>
            취소
          </Button>
          <Button
            variant='approve'
            size='approve-reject'
            onClick={onConfirm}
            className='text-body-01-m h-18 flex-1 bg-blue-300 text-white'
          >
            확인
          </Button>
        </div>
      </div>
    </Modal>
  );
}
