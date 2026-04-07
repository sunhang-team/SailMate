'use client';

import { useState } from 'react';

import { ProfilePlaceholderIcon } from '@/components/ui/Icon';

interface SidebarAvatarProps {
  imageUrl: string;
  nickname: string;
  size?: number;
}

export function SidebarAvatar({ imageUrl, nickname, size = 200 }: SidebarAvatarProps) {
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);

  const hasImage = !!imageUrl && failedImageUrl !== imageUrl;

  if (hasImage) {
    return (
      <span
        className='border-gray-150 inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border bg-gray-100'
        style={{ width: size, height: size }}
      >
        <img
          src={imageUrl}
          alt={`${nickname} 프로필 이미지`}
          className='h-full w-full object-cover'
          onError={() => setFailedImageUrl(imageUrl)}
        />
      </span>
    );
  }

  return <ProfilePlaceholderIcon size={size} className='shrink-0 rounded-full' aria-label='기본 프로필 아이콘' />;
}
