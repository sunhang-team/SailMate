'use client';

import { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';

import { useUpdateProfile, userQueries } from '@/api/users/queries';
import { updateProfileFormSchema } from '@/api/users/schemas';
import { PATCH_ME_NICKNAME_CONFLICT_STATUS, type UpdateProfileForm } from '@/api/users/types';
import { useToastStore } from '@/components/ui/Toast/useToastStore';
import { cn } from '@/lib/cn';

import { ActivityEnergySection } from './ActivityEnergySection';
import { ActivityStatsSection } from './ActivityStatsSection';
import { ProfileIdentitySection } from './ProfileIdentitySection';
import { SidebarAvatar } from './SidebarAvatar';

interface ProfileSidebarProps {
  className?: string;
}

export function ProfileSidebarSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'border-gray-150 bg-gray-0 w-full max-w-[450px] animate-pulse rounded-2xl border px-7 py-12 shadow-(--shadow-02)',
        className,
      )}
    >
      <div className='flex flex-col items-center gap-4'>
        <div className='bg-gray-150 size-24 rounded-full' />
        <div className='bg-gray-150 h-6 w-32 rounded' />
        <div className='bg-gray-150 h-10 w-full max-w-[280px] rounded-full' />
        <div className='bg-gray-150 h-[60px] w-full rounded-lg' />
      </div>
      <div className='border-gray-150 mt-6 border-t pt-6'>
        <div className='bg-gray-150 mb-4 h-5 w-40 rounded' />
        <div className='bg-gray-150 h-4 w-full rounded-full' />
      </div>
      <div className='border-gray-150 mt-6 space-y-3 border-t pt-6'>
        <div className='bg-gray-150 h-4 w-full rounded' />
        <div className='bg-gray-150 h-4 w-full rounded' />
        <div className='bg-gray-150 h-4 w-full rounded' />
      </div>
    </div>
  );
}

export function ProfileSidebar({ className }: ProfileSidebarProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { data: user } = useSuspenseQuery(userQueries.me());
  const showToast = useToastStore((s) => s.showToast);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<UpdateProfileForm>({
    resolver: zodResolver(updateProfileFormSchema),
    defaultValues: { nickname: user.nickname, profileImage: user.profileImage },
  });

  const nicknameDraft = watch('nickname');
  const profileImageDraft = watch('profileImage');

  useEffect(() => {
    if (!isEditing) {
      reset({ nickname: user.nickname, profileImage: user.profileImage });
    }
  }, [user.nickname, user.profileImage, reset, isEditing]);

  const { mutate, isPending } = useUpdateProfile({
    onSuccess: () => {
      showToast({ variant: 'success', title: '프로필이 저장되었습니다.' });
      setIsEditing(false);
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === PATCH_ME_NICKNAME_CONFLICT_STATUS) {
        showToast({ variant: 'error', title: '이미 사용 중인 닉네임입니다.' });
        return;
      }
      showToast({ variant: 'error', title: '프로필 저장에 실패했습니다.' });
    },
  });

  const onSubmit = (data: UpdateProfileForm) => mutate(data);

  const handleCancelEdit = () => {
    reset({ nickname: user.nickname, profileImage: user.profileImage });
    setIsEditing(false);
  };

  const startEdit = () => {
    reset({ nickname: user.nickname, profileImage: user.profileImage });
    setIsEditing(true);
  };

  const completedGatherings = user.completedGatherings ?? 0;
  const avgAchievementRate = user.avgAchievementRate ?? 0;
  const reviewCount = user.reviewCount ?? 0;

  const statRows = [
    { label: '완료한 모임', value: `${completedGatherings}개` },
    { label: '평균 달성률', value: `${avgAchievementRate}%` },
    { label: '받은 리뷰', value: `${reviewCount}개` },
  ];

  const previewImageUrl = isEditing ? (profileImageDraft ?? '') : user.profileImage;
  const previewNickname = isEditing ? nicknameDraft || user.nickname : user.nickname;

  const identityProps = {
    isEditing,
    user,
    previewImageUrl,
    previewNickname,
    register,
    handleSubmit,
    errors,
    isPending,
    onSubmit,
    onCancelEdit: handleCancelEdit,
    onStartEdit: startEdit,
  };

  return (
    <aside
      className={cn(
        'border-gray-150 bg-gray-0 w-full rounded-2xl border px-6 py-6 shadow-(--shadow-02) md:max-h-none md:px-7 md:py-8 lg:max-h-none lg:min-h-[915px] lg:max-w-[450px] lg:px-7 lg:py-12',
        className,
      )}
    >
      <div className='md:hidden'>
        <ProfileIdentitySection layout='mobile' {...identityProps} />
      </div>

      <div className='hidden p-8 md:flex md:w-full lg:hidden'>
        <div className='md:border-gray-150 flex flex-col items-center md:shrink-0 md:border-r md:pr-8'>
          <div className='flex flex-col items-center'>
            <SidebarAvatar imageUrl={previewImageUrl} nickname={previewNickname} size={140} />
          </div>
          <ProfileIdentitySection layout='tablet' {...identityProps} />
        </div>

        <div className='flex flex-col md:w-full md:flex-1 md:pl-8'>
          <ActivityEnergySection
            variant='tablet'
            reputationScore={user.reputationScore}
            reputationLabel={user.reputationLabel}
          />
          <ActivityStatsSection variant='tablet' rows={statRows} />
        </div>
      </div>

      <div className='hidden w-full flex-col items-center lg:flex'>
        <ProfileIdentitySection layout='desktop' {...identityProps} />
      </div>

      <div className='md:hidden lg:block'>
        <ActivityEnergySection
          variant='wide'
          reputationScore={user.reputationScore}
          reputationLabel={user.reputationLabel}
        />
        <ActivityStatsSection variant='wide' rows={statRows} />
      </div>
    </aside>
  );
}
