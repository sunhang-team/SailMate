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
    <Modal
      isOpen={isOpen}
      onClose={() => onClose(false)}
      className='max-h-[90vh] w-[327px] max-w-[calc(100%-48px)] overflow-hidden rounded-2xl min-[744px]:w-[600px] lg:w-[688px]'
    >
      <CloseIcon
        size={48}
        onClick={() => onClose(false)}
        className='absolute top-4 right-4 z-10 size-7 cursor-pointer p-1 text-gray-600 min-[744px]:top-5 min-[744px]:right-5 min-[744px]:size-12 min-[744px]:p-2'
      />
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
