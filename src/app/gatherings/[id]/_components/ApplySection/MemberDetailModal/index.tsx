'use client';

import { Modal } from '@/components/ui/Modal';
import { CloseIcon } from '@/components/ui/Icon';
import { SuspenseBoundary } from '@/components/SuspenseBoundary';
import { MemberDetailContent } from './MemberDetailContent';

interface MemberDetailModalProps<T = boolean> {
  memberId: number;
  isOpen: boolean;
  onClose: (value: T) => void;
}

export function MemberDetailModal({ memberId, isOpen, onClose }: MemberDetailModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)} className='w-[calc(100%-48px)] max-w-2xl md:w-full'>
      <CloseIcon size={48} onClick={() => onClose(false)} className='absolute top-6 right-6 z-10 cursor-pointer p-2' />
      <SuspenseBoundary
        errorFallback={<div>에러</div>}
        pendingFallback={
          <div className='flex h-[400px] flex-col items-center justify-center gap-4 text-gray-400'>
            <div className='h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent' />
            프로필 정보를 불러오는 중입니다...
          </div>
        }
        resetKeys={[memberId]}
      >
        <MemberDetailContent memberId={memberId} />
      </SuspenseBoundary>
    </Modal>
  );
}
