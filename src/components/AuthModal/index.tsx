'use client';

import { Modal } from '@/components/ui/Modal';

import { AuthFunnel } from './AuthFunnel';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Body className='px-6 py-8'>
        <AuthFunnel onSuccess={onSuccess ? onSuccess : onClose} />
      </Modal.Body>
    </Modal>
  );
}
