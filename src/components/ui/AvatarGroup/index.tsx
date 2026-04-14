'use client';

import { cva } from 'class-variance-authority';
import Image from 'next/image';

import { cn } from '@/lib/cn';
import { useFallbackImage } from '@/hooks/useFallbackImage';

const avatarSizeVariants = cva('relative bg-gray-300 flex items-center justify-center overflow-hidden', {
  variants: {
    size: {
      sm: 'h-5 w-5',
      md: 'h-8 w-8',
    },
    shape: {
      full: 'rounded-full',
      lg: 'rounded-lg',
    },
    hasBorder: {
      true: 'border-2 border-gray-0',
      false: 'border-0',
    },
  },
  defaultVariants: {
    size: 'sm',
    shape: 'full',
    hasBorder: true,
  },
});

const overflowSizeVariants = cva('bg-gray-200 flex items-center justify-center text-gray-500 font-medium', {
  variants: {
    size: {
      sm: 'h-5 w-5 text-[8px]',
      md: 'h-8 w-8 text-[10px]',
    },
    shape: {
      full: 'rounded-full',
      lg: 'rounded-lg',
    },
    hasBorder: {
      true: 'border-2 border-gray-0',
      false: 'border-0',
    },
  },
  defaultVariants: {
    size: 'sm',
    shape: 'full',
    hasBorder: true,
  },
});

interface AvatarItem {
  id?: number;
  imageUrl?: string | null;
}

interface AvatarGroupProps {
  /** 아바타 이미지 URL 배열 */
  avatars: AvatarItem[];
  /** 최대 표시 개수 (초과 시 +N 표시) */
  max?: number;
  /** 아바타 크기 */
  size?: 'sm' | 'md';
  /** 아바타 모양 */
  shape?: 'full' | 'lg';
  /** 보더 노출 여부 */
  hasBorder?: boolean;
  className?: string;
}

export function AvatarGroup({
  avatars,
  max,
  size = 'sm',
  shape = 'full',
  hasBorder = true,
  className,
}: AvatarGroupProps) {
  const displayAvatars = max ? avatars.slice(0, max) : avatars;
  const overflowCount = max && avatars.length > max ? avatars.length - max : 0;

  return (
    <div className={cn('flex items-center -space-x-2', className)}>
      {displayAvatars.map((avatar, index) => (
        <div key={avatar.id ?? index} className={avatarSizeVariants({ size, shape, hasBorder })}>
          <AvatarImage imageUrl={avatar.imageUrl} alt={`멤버 ${index + 1}`} />
        </div>
      ))}
      {overflowCount > 0 && <div className={overflowSizeVariants({ size, shape })}>+{overflowCount}</div>}
    </div>
  );
}

function AvatarImage({ imageUrl, alt }: { imageUrl?: string | null; alt: string }) {
  const { imgSrc, onError } = useFallbackImage(imageUrl);

  return <Image src={imgSrc} alt={alt} fill className='object-cover' onError={onError} />;
}
