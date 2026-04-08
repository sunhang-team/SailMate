'use client';

import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface RejectConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function RejectConfirmModal({ isOpen, onClose, onConfirm }: RejectConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>
        <h2 className='text-body-02-sb text-gray-900'>신청을 거부하시겠습니까?</h2>
      </Modal.Header>
      <Modal.Body>
        <p className='text-small-02-r text-gray-500'>거부한 신청은 되돌릴 수 없습니다.</p>
      </Modal.Body>
      <Modal.Footer className='flex gap-2'>
        <Button variant='cancel' size='cancel' onClick={onClose} className='h-14 w-full'>
          취소
        </Button>
        <Button variant='primary' size='action-sm' onClick={onConfirm} className='h-14 w-full'>
          확인
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
