'use client';

import Image from 'next/image';

import { ProfilePlaceholderIcon } from '@/components/ui/Icon';
import { useFallbackImage } from '@/hooks/useFallbackImage';

interface SidebarAvatarProps {
  imageUrl: string;
  nickname: string;
  size?: number;
}

export function SidebarAvatar({ imageUrl, nickname, size = 200 }: SidebarAvatarProps) {
  const { imgSrc, onError } = useFallbackImage(imageUrl);

  return (
    <span
      className='border-gray-150 relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border'
      style={{ width: size, height: size }}
    >
      {imgSrc ? (
        <Image src={imgSrc} alt={`${nickname} 프로필 이미지`} fill className='object-cover' onError={onError} />
      ) : (
        <ProfilePlaceholderIcon className='h-full w-full' />
      )}
    </span>
  );
}
