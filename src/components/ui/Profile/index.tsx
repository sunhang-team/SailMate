'use client';

import { useState } from 'react';

import { cn } from '@/lib/cn';
import { ProfilePlaceholderIcon } from '@/components/ui/Icon';

interface ProfileProps {
  imageUrl?: string | null;
  nickname?: string;
  className?: string;
}

export function Profile({ imageUrl, nickname, className }: ProfileProps) {
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);

  const hasImage = !!imageUrl && failedImageUrl !== imageUrl;
  const altText = nickname ? `${nickname} 프로필 이미지` : '프로필 이미지';

  if (hasImage) {
    return (
      <span
        className={cn(
          'border-gray-150 inline-flex h-[42px] w-[42px] items-center justify-center overflow-hidden rounded-full border bg-gray-100',
          className,
        )}
      >
        <img
          src={imageUrl}
          alt={altText}
          className='h-full w-full object-cover'
          onError={() => setFailedImageUrl(imageUrl)}
        />
      </span>
    );
  }

  return <ProfilePlaceholderIcon size={42} className={cn('rounded-full', className)} aria-label='기본 프로필 아이콘' />;
}
