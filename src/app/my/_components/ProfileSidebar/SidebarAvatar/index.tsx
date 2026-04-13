import { useState } from 'react';
import Image from 'next/image';

import { DEFAULT_PROFILE_IMAGE } from '@/constants/image';

interface SidebarAvatarProps {
  imageUrl: string;
  nickname: string;
  size?: number;
}

export function SidebarAvatar({ imageUrl, nickname, size = 200 }: SidebarAvatarProps) {
  return (
    <span
      className='border-gray-150 relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border bg-gray-100'
      style={{ width: size, height: size }}
    >
      <Image
        src={imageUrl || DEFAULT_PROFILE_IMAGE}
        alt={`${nickname} 프로필 이미지`}
        fill
        className='object-cover'
        onError={(e) => {
          (e.target as HTMLImageElement).src = DEFAULT_PROFILE_IMAGE;
        }}
      />
    </span>
  );
}
