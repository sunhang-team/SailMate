'use client';

import type { FieldErrors, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';

import type { UpdateProfileForm, User } from '@/api/users/types';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';

import { ProfileEditForm } from '../ProfileEditForm';
import { ProviderIconBadge } from '../ProviderIconBadge';
import { SidebarAvatar } from '../SidebarAvatar';

interface ProfileIdentitySectionProps {
  layout: 'mobile' | 'tablet' | 'desktop';
  isEditing: boolean;
  user: Pick<User, 'nickname' | 'email' | 'provider' | 'profileImage'>;
  previewImageUrl: string;
  previewNickname: string;
  register: UseFormRegister<UpdateProfileForm>;
  handleSubmit: UseFormHandleSubmit<UpdateProfileForm>;
  errors: FieldErrors<UpdateProfileForm>;
  isPending: boolean;
  onSubmit: (data: UpdateProfileForm) => void;
  onCancelEdit: () => void;
  onStartEdit: () => void;
}

export function ProfileIdentitySection({
  layout,
  isEditing,
  user,
  previewImageUrl,
  previewNickname,
  register,
  handleSubmit,
  errors,
  isPending,
  onSubmit,
  onCancelEdit,
  onStartEdit,
}: ProfileIdentitySectionProps) {
  if (isEditing) {
    return (
      <ProfileEditForm
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        isPending={isPending}
        onSubmit={onSubmit}
        onCancel={onCancelEdit}
      />
    );
  }

  if (layout === 'mobile') {
    return (
      <>
        <div className='flex w-full items-center gap-4'>
          <SidebarAvatar imageUrl={previewImageUrl} nickname={previewNickname} size={80} />
          <div className='min-w-0 flex-1'>
            <h2 className='text-body-01-b text-gray-900'>{user.nickname}</h2>
            <div className='mt-2 flex min-w-0 items-center gap-2'>
              <Tag variant='email'>{user.email}</Tag>
              <ProviderIconBadge provider={user.provider} />
            </div>
          </div>
        </div>
        <Button
          type='button'
          variant='mypage-edit'
          size='mypage-edit'
          className='mt-4 w-full max-w-full justify-center'
          onClick={onStartEdit}
        >
          내 정보 수정
        </Button>
      </>
    );
  }

  if (layout === 'tablet') {
    return (
      <>
        <h2 className='text-h5-b mb-2 text-gray-900'>{user.nickname}</h2>
        <div className='flex w-full max-w-[200px] items-center justify-center gap-2'>
          <Tag variant='email'>{user.email}</Tag>
          <ProviderIconBadge provider={user.provider} />
        </div>
        <Button
          type='button'
          variant='mypage-edit'
          size='mypage-edit'
          className='mt-6 w-full max-w-full justify-center'
          onClick={onStartEdit}
        >
          내 정보 수정
        </Button>
      </>
    );
  }

  return (
    <>
      <div className='flex flex-col items-center py-4'>
        <SidebarAvatar imageUrl={previewImageUrl} nickname={previewNickname} size={200} />
      </div>
      <h2 className='text-h3-b mb-2 text-gray-900'>{user.nickname}</h2>
      <div className='flex w-full max-w-[280px] items-center justify-center gap-2'>
        <Tag variant='email'>{user.email}</Tag>
        <ProviderIconBadge provider={user.provider} />
      </div>
      <Button
        type='button'
        variant='mypage-edit'
        size='mypage-edit'
        className='mt-10 w-full max-w-full justify-center'
        onClick={onStartEdit}
      >
        내 정보 수정
      </Button>
    </>
  );
}
