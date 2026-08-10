'use client';

import Image from 'next/image';

import { ProgressBar } from '@/components/ui/Progress';
import { Tag } from '@/components/ui/Tag';
import { IllustrationIcon } from '@/components/ui/Icon';
import { useFallbackImage } from '@/hooks/useFallbackImage';
import type { UserPublicProfile } from '@/api/users/types';

interface ProfileHeaderProps {
  profile: UserPublicProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const { imgSrc, onError } = useFallbackImage(profile.profileImage);

  return (
    <div className='flex w-full items-center gap-4 min-[744px]:gap-6'>
      <div className='relative size-19.75 shrink-0 overflow-hidden rounded-lg bg-gray-100 shadow-sm min-[744px]:size-32.75 min-[744px]:rounded-2xl'>
        <Image src={imgSrc} alt={`${profile.nickname} 프로필 이미지`} fill className='object-cover' onError={onError} />
      </div>

      <div className='flex min-w-0 flex-1 flex-col justify-center gap-4 min-[744px]:gap-7'>
        <div className='flex min-w-0 items-center gap-3 min-[744px]:gap-4'>
          <div className='text-body-02-b min-[744px]:text-h3-b text-gray-900'>{profile.nickname}</div>
          <Tag variant='mate'>{profile.reputationLabel || '참여 메이트'}</Tag>
        </div>
        <ProgressBar value={profile.reputationScore || 0} barClassName='h-2 min-[744px]:h-4'>
          <div className='text-small-02-m flex items-center justify-between'>
            <div className='text-small-02-m min-[744px]:text-body-01-m text-gray-800'>활동 에너지</div>
            <div className='flex items-center gap-2'>
              <span className='text-small-02-sb min-[744px]:text-body-01-sb text-blue-300'>
                {profile.reputationScore || 0}점
              </span>
              <IllustrationIcon variant='fire' className='size-5 min-[744px]:size-8' />
            </div>
          </div>
        </ProgressBar>
      </div>
    </div>
  );
}
