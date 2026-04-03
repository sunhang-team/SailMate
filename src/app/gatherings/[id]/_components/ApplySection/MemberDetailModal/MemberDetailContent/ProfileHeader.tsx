import { Modal } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/Progress';
import { Tag } from '@/components/ui/Tag';
import { IllustrationIcon } from '@/components/ui/Icon';
import type { UserPublicProfile } from '@/api/users/types';

interface ProfileHeaderProps {
  profile: UserPublicProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <>
      <div className='h-19.75 w-19.75 shrink-0 overflow-hidden rounded-2xl bg-gray-100 shadow-sm md:h-32.75 md:w-32.75'>
        {profile.profileImage && (
          <img
            src={profile.profileImage}
            alt={`${profile.nickname} 프로필 이미지`}
            className='h-full w-full object-cover'
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNFMkU4RjAiLz48L3N2Zz4=';
            }}
          />
        )}
      </div>

      <div className='flex flex-1 flex-col justify-center'>
        <div className='mb-4 flex items-center gap-4'>
          <div className='text-body-02-b md:text-h3-b text-gray-900'>{profile.nickname}</div>
          <Tag variant='mate'>{profile.reputationLabel || '참여 메이트'}</Tag>
        </div>
        <ProgressBar value={profile.reputationScore || 0} barClassName='h-4'>
          <div className='text-small-02-m flex items-center justify-between'>
            <div className='text-small-02-m md:text-body-01-m text-gray-800'>활동 에너지</div>
            <div className='flex items-center gap-2'>
              <span className='text-small-02-sb md:text-body-01-sb text-blue-300'>
                {profile.reputationScore || 0}점
              </span>
              <IllustrationIcon variant='fire' className='size-6 md:size-8' />
            </div>
          </div>
        </ProgressBar>
      </div>
    </>
  );
}
