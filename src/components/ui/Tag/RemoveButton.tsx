'use client';

import { CloseIcon } from '@/components/ui/Icon';

interface RemoveButtonProps {
  onRemove: () => void;
}

export function RemoveButton({ onRemove }: RemoveButtonProps) {
  return (
    <button
      type='button'
      onClick={onRemove}
      className='inline-flex items-center justify-center text-gray-600'
      aria-label='삭제'
    >
      <CloseIcon size={24} />
    </button>
  );
}
