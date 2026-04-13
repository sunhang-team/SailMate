'use client';

import Image from 'next/image';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/cn';
import { DEFAULT_PROFILE_IMAGE } from '@/constants/image';

const profileVariants = cva('relative inline-flex items-center justify-center overflow-hidden bg-gray-100 shrink-0', {
  variants: {
    size: {
      sm: 'h-6 w-6',
      md: 'h-[42px] w-[42px]',
      lg: 'h-12 w-12',
    },
    shape: {
      full: 'rounded-full',
      lg: 'rounded-lg',
    },
    hasBorder: {
      true: 'border border-gray-150',
      false: 'border-0',
    },
  },
  defaultVariants: {
    size: 'md',
    shape: 'full',
    hasBorder: true,
  },
});

interface ProfileProps extends VariantProps<typeof profileVariants> {
  imageUrl?: string | null;
  className?: string;
}

export function Profile({ imageUrl, size, shape, hasBorder, className }: ProfileProps) {
  return (
    <div className={cn(profileVariants({ size, shape, hasBorder }), className)}>
      <Image
        src={imageUrl || DEFAULT_PROFILE_IMAGE}
        alt='프로필 이미지'
        fill
        className='object-cover'
        onError={(e) => {
          (e.target as HTMLImageElement).src = DEFAULT_PROFILE_IMAGE;
        }}
      />
    </div>
  );
}
