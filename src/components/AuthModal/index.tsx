'use client';

import { Modal } from '@/components/ui/Modal';
import { AuthFunnel } from './AuthFunnel';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Body className='px-6 py-8'>
        <AuthFunnel onSuccess={onClose} />
      </Modal.Body>
    </Modal>
  );
}
