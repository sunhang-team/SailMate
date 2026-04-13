import { cva } from 'class-variance-authority';

import { cn } from '@/lib/cn';

const avatarSizeVariants = cva('bg-gray-300 flex items-center justify-center overflow-hidden', {
  variants: {
    size: {
      sm: 'h-5 w-5',
      md: 'h-8 w-8',
    },
    shape: {
      circle: 'rounded-full border-2 border-gray-0',
      square: 'rounded',
    },
  },
  defaultVariants: {
    size: 'sm',
    shape: 'circle',
  },
});

const overflowSizeVariants = cva('bg-gray-200 flex items-center justify-center text-gray-500 font-medium', {
  variants: {
    size: {
      sm: 'h-5 w-5 text-[8px]',
      md: 'h-8 w-8 text-[10px]',
    },
    shape: {
      circle: 'rounded-full border-2 border-gray-0',
      square: 'rounded',
    },
  },
  defaultVariants: {
    size: 'sm',
    shape: 'circle',
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
  shape?: 'circle' | 'square';
  className?: string;
}

const PLACEHOLDER_COLORS = ['bg-gray-300', 'bg-gray-400', 'bg-gray-500'] as const;

export function AvatarGroup({ avatars, max, size = 'sm', shape = 'circle', className }: AvatarGroupProps) {
  const displayAvatars = max ? avatars.slice(0, max) : avatars;
  const overflowCount = max && avatars.length > max ? avatars.length - max : 0;

  return (
    <div className={cn('flex items-center -space-x-2', className)}>
      {displayAvatars.map((avatar, index) => (
        <div
          key={avatar.id ?? index}
          className={cn(
            avatarSizeVariants({ size, shape }),
            !avatar.imageUrl && PLACEHOLDER_COLORS[index % PLACEHOLDER_COLORS.length],
          )}
        >
          {avatar.imageUrl && (
            <img src={avatar.imageUrl} alt={`멤버 ${index + 1}`} className='h-full w-full object-cover' />
          )}
        </div>
      ))}
      {overflowCount > 0 && <div className={overflowSizeVariants({ size, shape })}>+{overflowCount}</div>}
    </div>
  );
}
