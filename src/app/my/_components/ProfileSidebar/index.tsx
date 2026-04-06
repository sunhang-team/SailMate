'use client';

import { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';

import { useUpdateProfile, userQueries } from '@/api/users/queries';
import { updateProfileFormSchema } from '@/api/users/schemas';
import { PATCH_ME_NICKNAME_CONFLICT_STATUS, type AuthProvider, type UpdateProfileForm } from '@/api/users/types';
import { Button } from '@/components/ui/Button';
import {
  EmailIcon,
  GoogleIcon,
  IllustrationIcon,
  InfoIcon,
  KakaoIcon,
  ProfilePlaceholderIcon,
} from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/Progress';
import { Tag } from '@/components/ui/Tag';
import { useToastStore } from '@/components/ui/Toast/useToastStore';
import { cn } from '@/lib/cn';

interface ProfileSidebarProps {
  className?: string;
}

function ProviderIconBadge({ provider }: { provider: AuthProvider }) {
  const variant =
    provider === 'KAKAO' ? 'social-icon-kakao' : provider === 'GOOGLE' ? 'social-icon-google' : 'social-icon-email';
  const label =
    provider === 'KAKAO'
      ? '카카오로 가입한 계정'
      : provider === 'GOOGLE'
        ? '구글로 가입한 계정'
        : '이메일로 가입한 계정';

  const icon =
    provider === 'KAKAO' ? (
      <KakaoIcon className='size-3.5 md:size-5 lg:size-8' aria-hidden />
    ) : provider === 'GOOGLE' ? (
      <GoogleIcon className='size-3.5 md:size-5 lg:size-8' aria-hidden />
    ) : (
      <EmailIcon className='size-3.5 text-blue-300 md:size-5 lg:size-8' aria-hidden />
    );

  return (
    <Button
      type='button'
      variant={variant}
      size='social-icon'
      disabled
      tabIndex={-1}
      aria-label={label}
      title={label}
      className='pointer-events-none shrink-0'
    >
      {icon}
    </Button>
  );
}

function SidebarAvatar({ imageUrl, nickname, size = 200 }: { imageUrl: string; nickname: string; size?: number }) {
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
  const showToast = useToastStore((s) => s.showToast);
  const { data: user } = useSuspenseQuery(userQueries.me());

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

  return (
    <aside
      className={cn(
        'border-gray-150 bg-gray-0 w-full rounded-2xl border px-6 py-6 shadow-(--shadow-02) md:max-h-none md:px-7 md:py-8 lg:max-h-none lg:min-h-[915px] lg:max-w-[450px] lg:px-7 lg:py-12',
        className,
      )}
    >
      {/* Mobile (<md): 데스크톱(세로) 축약 버전 */}
      <div className='md:hidden'>
        {!isEditing ? (
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
              onClick={() => {
                reset({ nickname: user.nickname, profileImage: user.profileImage });
                setIsEditing(true);
              }}
            >
              내 정보 수정
            </Button>
          </>
        ) : (
          <form
            className='border-gray-150 flex w-full flex-col gap-4 rounded-xl border border-dashed p-4'
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <p className='text-body-02-sb text-gray-900'>내 정보 수정</p>
            <Input
              label={
                <>
                  닉네임 <span className='ml-1 text-blue-400'>*</span>
                </>
              }
              placeholder='닉네임을 입력해 주세요'
              error={errors.nickname?.message}
              maxLength={10}
              {...register('nickname')}
              className='h-11 w-full'
            />
            <Input
              label='프로필 이미지 URL'
              placeholder='비우면 기본 이미지 (jpg, png, webp URL)'
              error={errors.profileImage?.message}
              {...register('profileImage')}
              className='h-11 w-full'
            />
            <div className='flex w-full flex-wrap justify-end gap-2'>
              <Button
                type='button'
                variant='file-upload'
                size='file-upload'
                onClick={handleCancelEdit}
                disabled={isPending}
              >
                취소
              </Button>
              <Button type='submit' variant='primary' className='h-12 min-w-[100px] rounded-lg' disabled={isPending}>
                {isPending ? '저장 중...' : '저장'}
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Tablet (md ~ <lg): 2컬럼 카드 (첨부 시안) */}
      <div className='hidden p-8 md:flex md:w-full lg:hidden'>
        <div className='md:border-gray-150 flex flex-col items-center md:shrink-0 md:border-r md:pr-8'>
          <div className='flex flex-col items-center'>
            <SidebarAvatar imageUrl={previewImageUrl} nickname={previewNickname} size={140} />
          </div>

          {!isEditing ? (
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
                onClick={() => {
                  reset({ nickname: user.nickname, profileImage: user.profileImage });
                  setIsEditing(true);
                }}
              >
                내 정보 수정
              </Button>
            </>
          ) : (
            <form
              className='border-gray-150 flex w-full flex-col gap-4 rounded-xl border border-dashed p-4'
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <p className='text-body-02-sb text-gray-900'>내 정보 수정</p>
              <Input
                label={
                  <>
                    닉네임 <span className='ml-1 text-blue-400'>*</span>
                  </>
                }
                placeholder='닉네임을 입력해 주세요'
                error={errors.nickname?.message}
                maxLength={10}
                {...register('nickname')}
                className='h-11 w-full'
              />
              <Input
                label='프로필 이미지 URL'
                placeholder='비우면 기본 이미지 (jpg, png, webp URL)'
                error={errors.profileImage?.message}
                {...register('profileImage')}
                className='h-11 w-full'
              />
              <div className='flex w-full flex-wrap justify-end gap-2'>
                <Button
                  type='button'
                  variant='file-upload'
                  size='file-upload'
                  onClick={handleCancelEdit}
                  disabled={isPending}
                >
                  취소
                </Button>
                <Button type='submit' variant='primary' className='h-12 min-w-[100px] rounded-lg' disabled={isPending}>
                  {isPending ? '저장 중...' : '저장'}
                </Button>
              </div>
            </form>
          )}
        </div>

        <div className='flex flex-col md:w-full md:flex-1 md:pl-8'>
          <div className='flex flex-col pb-7'>
            <div className='text-body-02-sb md:text-body-01-sb mb-5 flex items-center gap-2 text-gray-900 md:mb-6'>
              <span>내 활동 에너지</span>
              <InfoIcon className='size-4 shrink-0 text-gray-400 md:size-6' aria-label='활동 에너지 안내' />
            </div>
            <div className='mb-2 flex items-center justify-between gap-2'>
              <div className='flex items-center gap-2'>
                <span className='text-body-02-sb md:text-body-01-sb text-blue-300'>{user.reputationScore}점</span>
                <IllustrationIcon variant='fire' className='size-5 shrink-0 md:size-7' aria-hidden />
              </div>
              <Tag variant='mate' className='shrink-0'>
                {user.reputationLabel || '참여 메이트'}
              </Tag>
            </div>
            <ProgressBar value={user.reputationScore} barClassName='h-3 rounded-full bg-blue-100' className='gap-0' />
          </div>

          <div className='border-gray-150 border-t pt-6 md:pt-7'>
            <p className='text-body-02-sb md:text-body-01-sb mb-5 text-gray-900 md:mb-6'>활동 통계</p>
            <dl className='flex flex-col gap-4'>
              {statRows.map((row) => (
                <div key={row.label} className='text-small-02-m md:text-small-01-m flex items-center justify-between'>
                  <dt className='shrink-0 text-gray-800'>{row.label}</dt>
                  <dd className='text-small-02-sb md:text-small-01-sb text-gray-700'>{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* PC (lg+): 기존(세로 스택) 레이아웃 */}
      <div className='hidden w-full flex-col items-center lg:flex'>
        <div className='flex flex-col items-center py-4'>
          <SidebarAvatar imageUrl={previewImageUrl} nickname={previewNickname} size={200} />
        </div>

        {!isEditing ? (
          <>
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
              onClick={() => {
                reset({ nickname: user.nickname, profileImage: user.profileImage });
                setIsEditing(true);
              }}
            >
              내 정보 수정
            </Button>
          </>
        ) : (
          <form
            className='border-gray-150 flex w-full flex-col gap-4 rounded-xl border border-dashed p-4'
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <p className='text-body-02-sb text-gray-900'>내 정보 수정</p>
            <Input
              label={
                <>
                  닉네임 <span className='ml-1 text-blue-400'>*</span>
                </>
              }
              placeholder='닉네임을 입력해 주세요'
              error={errors.nickname?.message}
              maxLength={10}
              {...register('nickname')}
              className='h-11 w-full'
            />
            <Input
              label='프로필 이미지 URL'
              placeholder='비우면 기본 이미지 (jpg, png, webp URL)'
              error={errors.profileImage?.message}
              {...register('profileImage')}
              className='h-11 w-full'
            />
            <div className='flex w-full flex-wrap justify-end gap-2'>
              <Button
                type='button'
                variant='file-upload'
                size='file-upload'
                onClick={handleCancelEdit}
                disabled={isPending}
              >
                취소
              </Button>
              <Button type='submit' variant='primary' className='h-12 min-w-[100px] rounded-lg' disabled={isPending}>
                {isPending ? '저장 중...' : '저장'}
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* 공통 하단 섹션: Mobile(<md) + PC(lg+)에서 사용 (태블릿은 별도 레이아웃에서 렌더) */}
      <div className='md:hidden lg:block'>
        <div className='border-gray-150 mt-6 flex flex-col border-t pt-7'>
          <div className='text-body-01-sb mb-6 flex items-center gap-2 text-gray-900'>
            <span>내 활동 에너지</span>
            <InfoIcon className='size-6 shrink-0 text-gray-400' aria-label='활동 에너지 안내' />
          </div>
          <div className='mb-2 flex items-center justify-between gap-2'>
            <div className='flex items-center gap-2'>
              <span className='text-h5-sb text-blue-300'>{user.reputationScore}점</span>
              <IllustrationIcon variant='fire' className='size-8 shrink-0' aria-hidden />
            </div>
            <Tag variant='mate' className='shrink-0'>
              {user.reputationLabel || '참여 메이트'}
            </Tag>
          </div>
          <ProgressBar value={user.reputationScore} barClassName='h-3.5 rounded-full bg-blue-50' className='gap-0' />
        </div>

        <div className='border-gray-150 mt-6 border-t pt-7'>
          <p className='text-body-01-sb mb-6 text-gray-900'>활동 통계</p>
          <dl className='flex flex-col gap-4'>
            {statRows.map((row) => (
              <div key={row.label} className='text-body-02-m flex items-center justify-between'>
                <dt className='shrink-0 text-gray-800'>{row.label}</dt>
                <dd className='text-body-01-sb text-gray-700'>{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </aside>
  );
}
